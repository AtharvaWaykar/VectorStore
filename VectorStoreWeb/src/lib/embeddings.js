const EMBEDDING_DIMENSIONS = 384;
const MODEL_ID = 'Xenova/all-MiniLM-L6-v2';
let extractorPromise = null;

function fallbackEmbedding(text) {
  const vector = new Array(EMBEDDING_DIMENSIONS).fill(0);
  const normalized = String(text || '').toLowerCase();
  for (let i = 0; i < normalized.length; i += 1) {
    const bucket = (normalized.charCodeAt(i) + i * 31) % EMBEDDING_DIMENSIONS;
    vector[bucket] += 1;
  }
  const magnitude = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0)) || 1;
  return vector.map(value => value / magnitude);
}

async function loadExtractor() {
  if (extractorPromise) return extractorPromise;

  extractorPromise = import('@huggingface/transformers').then(async ({ pipeline, env }) => {
    env.allowLocalModels = false;
    env.useBrowserCache = true;
    return pipeline('feature-extraction', MODEL_ID);
  });

  return extractorPromise;
}

export async function embedText(text) {
  const enableLocalEmbeddings = import.meta.env.VITE_ENABLE_LOCAL_EMBEDDINGS !== 'false';
  const cleanText = String(text || '').trim();
  if (!cleanText) return fallbackEmbedding('');
  if (!enableLocalEmbeddings) return fallbackEmbedding(cleanText);

  try {
    const extractor = await loadExtractor();
    const output = await extractor(cleanText, { pooling: 'mean', normalize: true });
    return Array.from(output.data).slice(0, EMBEDDING_DIMENSIONS);
  } catch (error) {
    console.warn('Embedding model unavailable; using deterministic fallback.', error);
    return fallbackEmbedding(cleanText);
  }
}

export function getEmbeddingModelLabel() {
  return import.meta.env.VITE_ENABLE_LOCAL_EMBEDDINGS === 'false'
    ? 'keyword-compatible fallback vectors'
    : MODEL_ID;
}
