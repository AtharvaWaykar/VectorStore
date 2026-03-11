# HomeFind — Week 4 Tasks: Person A
**Voice Input**

## Context
You are working on `homefind.html` — a single HTML file React app (React via CDN, no build tools).

Week 3 delivered:
- LLM intent parser via `sendToLLM(rawText, activeRoom, activeBox)` returning structured JSON
- Switch statement routing: `add` → `embedAndStore()`, `search` → `handleSearch()`, `delete` → `handleDelete()`
- JSON schema: `{ intent: "add"|"search"|"delete"|"unknown", items|query|name }`
- Room pre-selector pill row with active room and box state
- Confirmation toast, loading states, error handling on the Add flow
- `embedAndStore()`, `handleDelete()` wired and working (Person B)
- Final item schema: `{ id, name, qty, room, box, vector, source, addedAt }`

Your job this week is to add **voice input** via the Web Speech API so users can speak naturally instead of typing. The transcript feeds into the exact same `sendToLLM()` pipeline already built — no separate flow needed.

---

## Tasks

### 1. Mic Button
Add a press-to-talk mic button next to the existing text input field on both the Add and Search tabs.

**Requirements:**
- Sits inline with the text input, right side
- Minimum 44px tap target (mobile)
- Visually distinct from the submit button
- Shows a pulsing animation while recording is active
- Disabled if Web Speech API is not supported by the browser

---

### 2. Web Speech API Integration
```js
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;
```

**Behavior:**
- **Press** mic button → `recognition.start()`
- **Release or tap again** → `recognition.stop()`
- On `result` event → get transcript → populate text input field with transcript → automatically trigger `sendToLLM()`
- On `end` event → reset mic button to idle state
- Show the transcript in the input field before submitting so the user can see what was heard

---

### 3. Visual Feedback States
| State | Visual |
|---|---|
| Idle | Mic icon, neutral color |
| Recording | Pulsing mic icon, accent color (red or blue) |
| Processing | Spinner, disabled — same as typing submit |
| Error | Brief shake animation, reset to idle |

---

### 4. Source Field
When input comes from voice, make sure `source: "voice"` is passed through the pipeline instead of `"text"`. The `sendToLLM()` call is the same — just ensure the source flag is set correctly before `embedAndStore()` is called.

---

### 5. Error Handling
Handle all of the following gracefully — no crashes, always show a readable message:

| Error | Message to show |
|---|---|
| Mic permission denied | "Microphone access denied. Please allow mic access in your browser settings." |
| No speech detected | "Didn't catch that — please try again." |
| Speech API not supported | Hide mic button entirely, show tooltip "Voice not supported on this browser" |
| Network error (online API) | "Voice recognition failed — please type instead." |

---

## Acceptance Criteria
- [ ] Press mic → speak "add a hammer to the garage" → transcript appears in input → LLM processes → item stored
- [ ] Press mic → speak "where is my hammer" → LLM returns search intent → results shown
- [ ] Mic button shows pulsing animation while recording
- [ ] Transcript is visible in input field before submission
- [ ] Denying mic permission shows friendly error, does not crash
- [ ] Mic button hidden/disabled on unsupported browsers
- [ ] `source: "voice"` set correctly on items added via mic
- [ ] Works on mobile Chrome and Safari (test both)

---

## Do Not Touch This Week
- `sendToLLM()` — already built, just call it
- `embedAndStore()` — owned by Person B
- `handleDelete()` — owned by Person B
- `handleSearch()` — owned by Person B
- Result cards UI — owned by Person C
- Settings flow — already complete
- IndexedDB wrapper — owned by Person B

---

## Notes
- `webkitSpeechRecognition` is needed for Safari — always check both `window.SpeechRecognition || window.webkitSpeechRecognition`
- Web Speech API requires HTTPS or localhost — will not work on plain HTTP
- Keep the text input functional alongside voice — voice is an enhancement, not a replacement
- The mic button on the Search tab and Add tab can share the same component with different context
