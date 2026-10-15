/** Cuts text at a word boundary so it fits in `max` characters, ending with an ellipsis. */
export function shorten(text: string | undefined, max: number) {
  if (!text || text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[\s,;:.]+$/, '')}…`;
}

/** "Hollis Brandt" → "HB". */
export function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

/** "2024-03-08" → "March 8, 2024". */
export function formatDate(iso: string, month: 'long' | 'short' = 'long') {
  const d = new Date(iso.length === 10 ? `${iso}T00:00:00` : iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString('en-US', { month, day: 'numeric', year: 'numeric' });
}
