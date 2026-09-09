const baseUrl = process.env.SMOKE_URL || 'http://127.0.0.1:4173';
const response = await fetch(baseUrl);
if (!response.ok) {
  throw new Error(`Smoke check failed: ${baseUrl} returned ${response.status}`);
}

const html = await response.text();
for (const marker of ['<div id="root"></div>', '/src/main.jsx']) {
  if (!html.includes(marker)) {
    throw new Error(`Smoke check failed: response did not contain ${marker}`);
  }
}

console.log(`Smoke check passed for ${baseUrl}`);
