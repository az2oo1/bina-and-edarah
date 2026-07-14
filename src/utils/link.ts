/**
 * Formats an external URL to ensure it has a protocol prefix (http:// or https://).
 * If the URL is empty or already has a protocol, it returns it as is.
 * Otherwise, it prepends https://.
 */
export const formatExternalLink = (url: string | null | undefined): string => {
  if (!url) return '';
  const trimmed = url.trim();
  if (/^(https?:\/\/|mailto:|tel:)/i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
};
