export function getTransformedUrl(
  path: string | null | undefined,
  _transforms?: any, // Ignored since we optimize before upload
): string {
  if (!path) return "";
  if (/^(https?|file|data|content):/i.test(path)) {
    return path;
  }
  const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL;
  return `${storageUrl}${path}`;
}
