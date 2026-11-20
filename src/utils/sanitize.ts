/**
 * Security utilities: sanitization, input validation, XSS prevention, and prompt defense
 */

/**
 * Escapes raw strings for safe inclusion in HTML contexts
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

/**
 * Strips dangerous HTML tags, malicious URL schemes, inline event handlers,
 * and dangerous markdown links from user inputs.
 */
export function sanitizeUserInput(input: string, maxLength: number = 1000): string {
  if (!input || typeof input !== 'string') return '';
  
  // Strip null bytes and dangerous control characters (preserve newline and tab)
  const cleaned = input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  
  // Truncate to maximum allowed length to prevent memory exhaust / DoS
  const truncated = cleaned.slice(0, maxLength).trim();
  
  // Strip dangerous tags: script, iframe, object, embed, style, meta, link (handles self-closing and void tags)
  let sanitized = truncated
    .replace(/<script\b[^>]*>(?:.*?<\/script>)?/gis, '')
    .replace(/<iframe\b[^>]*>(?:.*?<\/iframe>)?/gis, '')
    .replace(/<object\b[^>]*>(?:.*?<\/object>)?/gis, '')
    .replace(/<embed\b[^>]*>(?:.*?<\/embed>)?/gis, '')
    .replace(/<style\b[^>]*>(?:.*?<\/style>)?/gis, '')
    // Strip malicious URI schemes: javascript:, vbscript:, data:text/html
    .replace(/javascript\s*:/gi, '')
    .replace(/vbscript\s*:/gi, '')
    .replace(/data\s*:\s*text\/html/gi, '')
    // Strip inline HTML event handlers (onload=, onerror=, onclick=, etc.)
    .replace(/on\w+\s*=/gi, '')
    // Strip markdown links with dangerous schemes like [click](javascript:...)
    .replace(/\[([^\]]*)\]\((?:javascript|vbscript|data):[^\)]*\)/gi, '$1');

  return sanitized;
}

/**
 * Validates Google Gemini / generic API keys safely
 */
export function isValidApiKey(key: string): boolean {
  if (!key || typeof key !== 'string') return false;
  const trimmed = key.trim();
  // Gemini API keys typically start with AIzaSy and are 39 chars
  const geminiRegex = /^AIzaSy[A-Za-z0-9_-]{33}$/;
  // Also allow standard 20-80 character alphanumeric keys for custom API endpoints
  const genericKeyRegex = /^[A-Za-z0-9_.-]{20,80}$/;
  return geminiRegex.test(trimmed) || genericKeyRegex.test(trimmed);
}

/**
 * Guard against prompt injection attempts aimed at leaking system prompt or credentials
 */
export function guardPromptInjection(prompt: string): string {
  const sanitized = sanitizeUserInput(prompt, 1000);
  // Redact common prompt injection patterns from influencing system instructions
  return sanitized
    .replace(/ignore\s+(all\s+)?(previous|prior|above)\s+instructions/gi, '[filtered injection attempt]')
    .replace(/system\s+prompt\s+leak/gi, '[filtered]')
    .replace(/reveal\s+(the\s+)?(api[_\s]?key|secret)/gi, '[filtered]');
}
