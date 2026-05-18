export function normalizeLabel(value) {
  return String(value || '').trim().replace(/\s+/g, ' ');
}

export function buildEmbeddingText(item) {
  return [
    normalizeLabel(item.name),
    item.description ? normalizeLabel(item.description) : '',
    item.roomName ? `Room ${normalizeLabel(item.roomName)}` : '',
    item.boxName ? `Box ${normalizeLabel(item.boxName)}` : '',
  ].filter(Boolean).join('. ');
}

export function toPgVector(vector) {
  if (!Array.isArray(vector)) return null;
  return `[${vector.map(value => Number(value || 0).toFixed(8)).join(',')}]`;
}

export function parseVector(value) {
  if (Array.isArray(value)) return value.map(Number);
  if (typeof value !== 'string') return [];
  return value
    .replace(/^\[/, '')
    .replace(/\]$/, '')
    .split(',')
    .map(part => Number(part.trim()))
    .filter(Number.isFinite);
}

export function cosineSimilarity(a, b) {
  if (!a?.length || !b?.length || a.length !== b.length) return 0;
  let dot = 0;
  let magA = 0;
  let magB = 0;
  for (let i = 0; i < a.length; i += 1) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  if (!magA || !magB) return 0;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

export function keywordScore(query, item) {
  const q = normalizeLabel(query).toLowerCase();
  if (!q) return 0;
  const haystack = [
    item.name,
    item.description,
    item.roomName,
    item.boxName,
    item.status,
  ].filter(Boolean).join(' ').toLowerCase();

  if (haystack.includes(q)) return 1;
  return q.split(/\s+/).reduce((score, token) => {
    return token && haystack.includes(token) ? score + 0.15 : score;
  }, 0);
}
