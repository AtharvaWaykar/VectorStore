import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { HTML } from './htmlContent';

const DEFAULT_CAPABILITIES = {
  type: 'voice/capabilities',
  mode: 'disabled',
  speechAvailable: false,
};

const VOICE_ERROR_MESSAGES = {
  permission_denied: 'Microphone access denied. Please allow mic access in your browser settings.',
  no_speech: "Didn't catch that — please try again.",
  network: 'Voice recognition failed — please type instead.',
  unknown: 'Voice recognition failed — please type instead.',
};

const VOICE_CONTEXT_HINTS = [
  'garage',
  'kitchen',
  'bedroom',
  'office',
  'living room',
  'basement',
  'hammer',
  'wrench',
  'screwdriver',
  'box',
  'search',
  'add',
  'delete',
];

function mapVoiceError(errorCode) {
  switch (String(errorCode || '').toLowerCase()) {
    case 'not-allowed':
    case 'service-not-allowed':
      return 'permission_denied';
    case 'no-speech':
    case 'speech-timeout':
    case 'nomatch':
      return 'no_speech';
    case 'network':
      return 'network';
    default:
      return 'unknown';
  }
}

function buildWebViewEventScript(payload) {
  const serializedPayload = JSON.stringify(payload);
  const escapedPayload = JSON.stringify(serializedPayload);

  return `
    (function () {
      var bridge = window.__VECTORSTOCK_NATIVE_BRIDGE__;
      var payload = JSON.parse(${escapedPayload});
      if (bridge && typeof bridge.receive === 'function') {
        bridge.receive(payload);
      } else {
        window.__VECTORSTOCK_NATIVE_QUEUE__ = window.__VECTORSTOCK_NATIVE_QUEUE__ || [];
        window.__VECTORSTOCK_NATIVE_QUEUE__.push(payload);
      }
    })();
    true;
  `;
}

export default function App() {
  const webViewRef = useRef(null);
  const speechModuleRef = useRef(null);
  const voiceModeRef = useRef('disabled');
  const webViewReadyRef = useRef(false);
  const latestTranscriptRef = useRef('');
  const finalTranscriptSentRef = useRef(false);
  const stopRequestedRef = useRef(false);
  const stopRetryTimeoutRef = useRef(null);
  const [voiceCapabilities, setVoiceCapabilities] = useState(DEFAULT_CAPABILITIES);

  const emitToWebView = (payload) => {
    if (!webViewReadyRef.current || !webViewRef.current) return;
    webViewRef.current.injectJavaScript(buildWebViewEventScript(payload));
  };
  const emitVoiceDebug = (event, detail = '') => {
    emitToWebView({
      type: 'voice/debug',
      event,
      detail,
      at: new Date().toISOString(),
    });
  };

  useEffect(() => {
    let mounted = true;
    let cleanup = () => {};

    async function setupSpeechBridge() {
      try {
        const speech = require('expo-speech-recognition');
        const speechModule = speech?.ExpoSpeechRecognitionModule;
        const speechAvailable = Boolean(
          speechModule?.isRecognitionAvailable?.() && speechModule?.supportsRecording?.()
        );

        if (!speechAvailable) {
          throw new Error('Speech recognition unavailable');
        }

        speechModuleRef.current = speechModule;
        voiceModeRef.current = 'native';

        const subscriptions = [
          speechModule.addListener('start', () => {
            latestTranscriptRef.current = '';
            finalTranscriptSentRef.current = false;
            stopRequestedRef.current = false;
            if (stopRetryTimeoutRef.current) {
              clearTimeout(stopRetryTimeoutRef.current);
              stopRetryTimeoutRef.current = null;
            }
            emitVoiceDebug('native_start');
            emitToWebView({ type: 'voice/status', status: 'recording' });
            emitToWebView({ type: 'voice/volume', value: -2 });
          }),
          speechModule.addListener('speechstart', () => {
            emitVoiceDebug('speech_detected');
            emitToWebView({ type: 'voice/status', status: 'recording' });
          }),
          speechModule.addListener('result', (event) => {
            const transcript = String(event?.results?.[0]?.transcript || '').trim();
            if (!transcript) return;
            latestTranscriptRef.current = transcript;
            if (stopRequestedRef.current) return;
            emitVoiceDebug('partial_result', transcript);
            emitToWebView({
              type: 'voice/transcript',
              transcript,
              isFinal: false,
            });
          }),
          speechModule.addListener('volumechange', (event) => {
            emitToWebView({
              type: 'voice/volume',
              value: Number(event?.value ?? -2),
            });
          }),
          speechModule.addListener('nomatch', () => {
            latestTranscriptRef.current = '';
            finalTranscriptSentRef.current = false;
            stopRequestedRef.current = false;
            if (stopRetryTimeoutRef.current) {
              clearTimeout(stopRetryTimeoutRef.current);
              stopRetryTimeoutRef.current = null;
            }
            emitVoiceDebug('no_match');
            emitToWebView({
              type: 'voice/error',
              code: 'no_speech',
              message: VOICE_ERROR_MESSAGES.no_speech,
            });
          }),
          speechModule.addListener('error', (event) => {
            latestTranscriptRef.current = '';
            finalTranscriptSentRef.current = false;
            stopRequestedRef.current = false;
            if (stopRetryTimeoutRef.current) {
              clearTimeout(stopRetryTimeoutRef.current);
              stopRetryTimeoutRef.current = null;
            }
            const code = mapVoiceError(event?.error);
            emitVoiceDebug('native_error', `${code}: ${event?.message || ''}`.trim());
            emitToWebView({
              type: 'voice/error',
              code,
              message: VOICE_ERROR_MESSAGES[code] || VOICE_ERROR_MESSAGES.unknown,
            });
          }),
          speechModule.addListener('end', () => {
            if (stopRetryTimeoutRef.current) {
              clearTimeout(stopRetryTimeoutRef.current);
              stopRetryTimeoutRef.current = null;
            }
            const finalTranscript = String(latestTranscriptRef.current || '').trim();
            if (finalTranscript && !finalTranscriptSentRef.current) {
              emitVoiceDebug('final_result', finalTranscript);
              emitToWebView({
                type: 'voice/transcript',
                transcript: finalTranscript,
                isFinal: true,
              });
              finalTranscriptSentRef.current = true;
            }
            if (!finalTranscript && !finalTranscriptSentRef.current) {
              emitVoiceDebug('ended_without_transcript');
              emitToWebView({
                type: 'voice/error',
                code: 'no_speech',
                message: VOICE_ERROR_MESSAGES.no_speech,
              });
            }
            latestTranscriptRef.current = '';
            stopRequestedRef.current = false;
            emitVoiceDebug('native_end');
            emitToWebView({ type: 'voice/status', status: 'idle' });
            emitToWebView({ type: 'voice/volume', value: -2 });
          }),
        ];

        cleanup = () => {
          if (stopRetryTimeoutRef.current) {
            clearTimeout(stopRetryTimeoutRef.current);
            stopRetryTimeoutRef.current = null;
          }
          speechModuleRef.current?.stop?.();
          subscriptions.forEach(subscription => subscription?.remove?.());
        };

        if (mounted) {
          setVoiceCapabilities({
            type: 'voice/capabilities',
            mode: 'native',
            speechAvailable: true,
          });
        }
      } catch (error) {
        speechModuleRef.current = null;
        voiceModeRef.current = 'disabled';
        if (mounted) {
          setVoiceCapabilities(DEFAULT_CAPABILITIES);
        }
      }
    }

    setupSpeechBridge();

    return () => {
      mounted = false;
      cleanup();
    };
  }, []);

  useEffect(() => {
    emitToWebView(voiceCapabilities);
  }, [voiceCapabilities]);

  const handleVoiceStart = async () => {
    const speechModule = speechModuleRef.current;
    if (!speechModule || voiceModeRef.current !== 'native') {
      emitToWebView(DEFAULT_CAPABILITIES);
      return;
    }

    try {
      const permission = await speechModule.requestPermissionsAsync();
      if (!permission?.granted) {
        emitVoiceDebug('permission_denied');
        emitToWebView({
          type: 'voice/error',
          code: 'permission_denied',
          message: VOICE_ERROR_MESSAGES.permission_denied,
        });
        emitToWebView({ type: 'voice/status', status: 'idle' });
        return;
      }

      emitVoiceDebug('start_requested');
      emitToWebView({ type: 'voice/status', status: 'recording' });
      speechModule.start({
        lang: 'en-US',
        interimResults: true,
        maxAlternatives: 1,
        continuous: true,
        addsPunctuation: false,
        contextualStrings: VOICE_CONTEXT_HINTS,
        iosTaskHint: 'dictation',
        iosVoiceProcessingEnabled: true,
        volumeChangeEventOptions: {
          enabled: true,
          intervalMillis: 120,
        },
      });
    } catch (error) {
      emitVoiceDebug('start_failed', String(error?.message || error || 'unknown'));
      emitToWebView({
        type: 'voice/error',
        code: 'unknown',
        message: VOICE_ERROR_MESSAGES.unknown,
      });
      emitToWebView({ type: 'voice/status', status: 'idle' });
    }
  };

  const handleVoiceStop = () => {
    const speechModule = speechModuleRef.current;
    if (!speechModule || voiceModeRef.current !== 'native') return;
    stopRequestedRef.current = true;
    if (stopRetryTimeoutRef.current) {
      clearTimeout(stopRetryTimeoutRef.current);
      stopRetryTimeoutRef.current = null;
    }
    emitVoiceDebug('stop_requested', latestTranscriptRef.current);
    emitToWebView({ type: 'voice/status', status: 'processing' });
    speechModule.stop();
    stopRetryTimeoutRef.current = setTimeout(() => {
      if (!stopRequestedRef.current) return;
      emitVoiceDebug('stop_retry', latestTranscriptRef.current);
      speechModule.stop();
    }, 500);
  };

  const handleLLMRequest = async (payload) => {
    const { requestId, text, systemPrompt } = payload;
    const dbg = (event, detail = '') => emitVoiceDebug('llm_' + event, detail);
    try {
      const apiKey = process.env.EXPO_PUBLIC_GROQ_API_KEY;
      dbg('start', apiKey ? 'key_ok' : 'NO_KEY');
      if (!apiKey) {
        emitToWebView({ type: 'llm/response', requestId, error: 'GROQ_API_KEY not set' });
        return;
      }
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          max_tokens: 512,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: text },
          ],
        }),
      });
      dbg('http', String(response.status));
      const data = await response.json();
      if (!response.ok) {
        const errMsg = data?.error?.message || `API error ${response.status}`;
        dbg('api_err', errMsg);
        emitToWebView({ type: 'llm/response', requestId, error: errMsg });
        return;
      }
      const raw = data?.choices?.[0]?.message?.content || '';
      dbg('raw', raw.slice(0, 80));
      let result;
      try {
        result = JSON.parse(raw);
      } catch {
        dbg('parse_fail', raw.slice(0, 40));
        result = { intent: 'unknown', raw: text };
      }
      dbg('done', result.intent);
      emitToWebView({ type: 'llm/response', requestId, result });
    } catch (error) {
      const msg = String(error?.message || error || 'unknown');
      dbg('catch', msg);
      emitToWebView({ type: 'llm/response', requestId, error: msg });
    }
  };

  const handleWebViewMessage = (event) => {
    let payload;

    try {
      payload = JSON.parse(event?.nativeEvent?.data || '{}');
    } catch (error) {
      return;
    }

    switch (payload?.type) {
      case 'voice/check-support':
        emitToWebView(voiceCapabilities);
        break;
      case 'voice/start':
        void handleVoiceStart();
        break;
      case 'voice/stop':
        handleVoiceStop();
        break;
      case 'llm/request':
        void handleLLMRequest(payload);
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <WebView
        ref={webViewRef}
        source={{ html: HTML, baseUrl: 'https://localhost' }}
        style={styles.webview}
        originWhitelist={['*']}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        mixedContentMode="compatibility"
        scalesPageToFit={false}
        onMessage={handleWebViewMessage}
        onLoadEnd={() => {
          webViewReadyRef.current = true;
          emitToWebView(voiceCapabilities);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090e17',
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
  },
  webview: {
    flex: 1,
    backgroundColor: '#090e17',
  },
});
