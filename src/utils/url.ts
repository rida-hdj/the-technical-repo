const rawBase: string = import.meta.env.BASE_URL || '/';
export const baseUrl = rawBase.endsWith('/') ? rawBase : `${rawBase}/`;

export function url(path: string): string {
  const absolute = /^[a-z][a-z0-9+.-]*:/i;
  if (absolute.test(path) || path.startsWith('#') || path.startsWith('mailto:')) {
    return path;
  }
  return `${baseUrl}${path.replace(/^\/+/, '')}`;
}