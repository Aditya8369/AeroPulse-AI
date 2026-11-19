/**
 * Security utilities: sanitization, input validation, and XSS prevention
 */

export function sanitizeText(input: string): string {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

export function sanitizeUserInput(input: string, maxLength: number = 1000): string {
  if (!input || typeof input !== 'string') return '';
  
  // Strip control characters except newline and tab
  const cleaned = input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  
  // Truncate to maximum allowed length to prevent denial-of-service
  const truncated = cleaned.slice(0, maxLength).trim();
  
  // Remove potential script tags and javascript: URIs
  return truncated
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
}

export function isValidApiKey(key: string): boolean {
  if (!key || typeof key !== 'string') return false;
  // Gemini API keys typically start with AIzaSy and are 39 chars
  const geminiRegex = /^AIzaSy[A-Za-z0-9_-]{33}$/;
  // Also allow standard 20-60 character alphanumeric keys for custom endpoints
  const genericKeyRegex = /^[A-Za-z0-9_.-]{20,80}$/;
  return geminiRegex.test(key) || genericKeyRegex.test(key);
}
