const baseUrl = process.env.SMOKE_URL || 'http://127.0.0.1:4173';
const response = await fetch(baseUrl);
if (!response.ok) {
  throw new Error(`Smoke check failed: ${baseUrl} returned ${response.status}`);
}

const html = await response.text();
if (!html.includes('<div id="root"></div>')) {
  throw new Error('Smoke check failed: response did not contain the React root element');
}

if (!/<script[^>]+src="\/assets\/[^"']+\.js"/.test(html)) {
  throw new Error('Smoke check failed: response did not reference a built JavaScript asset');
}

console.log(`Smoke check passed for ${baseUrl}`);
