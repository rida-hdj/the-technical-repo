export function slugifyTag(tag: string): string {
  const slug = tag
    .normalize('NFKC')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\p{L}\p{N}_+.-]/gu, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();

  if (slug) return slug;
  return encodeURIComponent(tag);
}