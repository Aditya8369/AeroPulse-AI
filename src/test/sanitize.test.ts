import { describe, it, expect } from 'vitest';
import { sanitizeText, sanitizeUserInput, isValidApiKey } from '../utils/sanitize';

describe('sanitize and security tests', () => {
  it('escapes dangerous HTML characters', () => {
    const raw = '<script>alert("XSS")</script>';
    const escaped = sanitizeText(raw);
    expect(escaped).not.toContain('<script>');
    expect(escaped).toContain('&lt;script&gt;');
  });

  it('strips script tags and dangerous event handlers from user prompt', () => {
    const malicious = 'Hello <script>fetch("evil.com")</script> world <img src=x onerror=alert(1)>';
    const cleaned = sanitizeUserInput(malicious);
    expect(cleaned).not.toContain('<script>');
    expect(cleaned).not.toContain('onerror=');
    expect(cleaned).toContain('Hello');
  });

  it('truncates inputs exceeding max length to prevent memory DOS', () => {
    const longString = 'a'.repeat(2500);
    const cleaned = sanitizeUserInput(longString, 500);
    expect(cleaned.length).toBe(500);
  });

  it('validates API keys with regex checks', () => {
    expect(isValidApiKey('AIzaSyD-1234567890abcdefghijklmnopqrstuv')).toBe(true);
    expect(isValidApiKey('custom-api-key-1234567890-secure')).toBe(true);
    expect(isValidApiKey('')).toBe(false);
    expect(isValidApiKey('short')).toBe(false);
  });
});
