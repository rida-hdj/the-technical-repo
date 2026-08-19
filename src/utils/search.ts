export interface SearchEntry {
  id: string;
  title: string;
  description: string;
  type: 'main' | 'small';
  tags: string[];
  pubDate: string;
  parent: string | null;
}

export interface SearchResult {
  entry: SearchEntry;
  score: number;
}

const ARABIC_DIACRITICS =
  /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED]/g;
const TATWEEL = /\u0640/g;

export function normalize(text: string): string {
  return String(text)
    .toLowerCase()
    .replace(ARABIC_DIACRITICS, '')
    .replace(TATWEEL, '')
    .replace(/[\u0623\u0625\u0622]/g, '\u0627')
    .replace(/\u0649/g, '\u064A')
    .replace(/\s+/g, ' ')
    .trim();
}

export function tokenize(query: string): string[] {
  return normalize(query)
    .split(/\s+/)
    .filter((word) => word.length >= 2);
}

export function escapeHtml(text: string): string {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function highlightHtml(text: string, query: string): string {
  const tokens = tokenize(query);
  if (tokens.length === 0) return escapeHtml(text);

  const normalized = normalize(text);
  const ranges: [number, number][] = [];

  for (const token of tokens) {
    let from = 0;
    while (from < normalized.length) {
      const pos = normalized.indexOf(token, from);
      if (pos === -1) break;
      ranges.push([pos, pos + token.length]);
      from = pos + token.length;
    }
  }

  if (ranges.length === 0) return escapeHtml(text);

  ranges.sort((a, b) => a[0] - b[0]);
  const merged: [number, number][] = [ranges[0]];
  for (let i = 1; i < ranges.length; i++) {
    const last = merged[merged.length - 1];
    if (ranges[i][0] <= last[1]) {
      last[1] = Math.max(last[1], ranges[i][1]);
    } else {
      merged.push(ranges[i]);
    }
  }

  let out = '';
  let cursor = 0;
  for (const [start, end] of merged) {
    out += escapeHtml(text.slice(cursor, start));
    out += `<mark>${escapeHtml(text.slice(start, end))}</mark>`;
    cursor = end;
  }
  return out + escapeHtml(text.slice(cursor));
}

const MIN_SCORE = 1;

function scoreEntry(entry: SearchEntry, query: string, words: string[]): number {
  const title = normalize(entry.title);
  const description = normalize(entry.description);
  const tags = normalize(entry.tags.join(' '));
  const titleWords = title.split(/\s+/).filter(Boolean);
  const descriptionWords = description.split(/\s+/).filter(Boolean);

  let score = 0;

  if (title === query) {
    score += 1000;
  } else if (title.startsWith(query)) {
    score += 850;
  } else if (title.includes(query)) {
    score += 600;
    score += Math.max(0, (title.length - title.indexOf(query)) * 0.5);
  }

  let titleHits = 0;
  let titlePartial = 0;
  for (const word of words) {
    if (title.includes(word)) {
      titleHits++;
    } else if (titleWords.some((tw) => tw.startsWith(word))) {
      titlePartial++;
    }
  }
  score += titleHits * 140;
  score += titlePartial * 45;

  if (description.includes(query)) {
    score += 280;
  }
  let descriptionHits = 0;
  let descriptionPartial = 0;
  for (const word of words) {
    if (description.includes(word)) {
      descriptionHits++;
    } else if (descriptionWords.some((dw) => dw.startsWith(word))) {
      descriptionPartial++;
    }
  }
  score += descriptionHits * 55;
  score += descriptionPartial * 18;

  for (const word of words) {
    if (tags.includes(word)) score += 30;
  }

  return score >= MIN_SCORE ? score : 0;
}

export function searchPosts(
  index: SearchEntry[],
  rawQuery: string,
  limit = 8,
): SearchEntry[] {
  const query = normalize(rawQuery);
  const words = tokenize(query);

  if (!query || words.length === 0) return [];

  const scored: SearchResult[] = [];
  for (const entry of index) {
    const score = scoreEntry(entry, query, words);
    if (score > 0) scored.push({ entry, score });
  }

  scored.sort(
    (a, b) =>
      b.score - a.score ||
      new Date(b.entry.pubDate).valueOf() - new Date(a.entry.pubDate).valueOf(),
  );

  return scored.slice(0, limit).map((result) => result.entry);
}