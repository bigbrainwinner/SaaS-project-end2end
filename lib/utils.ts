/**
 * Converts a string to sentence case.
 * Capitalizes the first character of the string.
 * If the rest of the string is entirely uppercase, it converts it to lowercase.
 * Otherwise, it preserves any intentional casing (e.g. acronyms like SaaS, AWS).
 */
export function toSentenceCase(str: string): string {
  if (!str) return '';
  const trimmed = str.trim();
  if (trimmed.length === 0) return '';
  
  const firstChar = trimmed.charAt(0).toUpperCase();
  const rest = trimmed.slice(1);
  
  if (rest === rest.toUpperCase() && rest.length > 0) {
    return firstChar + rest.toLowerCase();
  }
  return firstChar + rest;
}
