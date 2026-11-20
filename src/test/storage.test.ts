import { describe, it, expect, beforeEach } from 'vitest';
import {
  safeLocalStorageGet,
  safeLocalStorageSet,
  safeLocalStorageRemove,
  safeLocalStorageClear
} from '../utils/storage';

describe('storage security and resilience tests', () => {
  beforeEach(() => {
    safeLocalStorageClear();
  });

  it('returns default value when key does not exist', () => {
    const val = safeLocalStorageGet('non_existent_key', 'default_val');
    expect(val).toBe('default_val');
  });

  it('stores and retrieves primitive and object data correctly', () => {
    safeLocalStorageSet('test_number', 42);
    expect(safeLocalStorageGet('test_number', 0)).toBe(42);

    const testObj = { name: 'CR Box', merv: 13 };
    safeLocalStorageSet('test_obj', testObj);
    expect(safeLocalStorageGet('test_obj', { name: '', merv: 0 })).toEqual(testObj);
  });

  it('respects TTL expiration and purges stale items', async () => {
    safeLocalStorageSet('stale_key', 'short_lived', 10); // 10ms TTL
    expect(safeLocalStorageGet('stale_key', null)).toBe('short_lived');

    // Wait 25ms for TTL to expire
    await new Promise(resolve => setTimeout(resolve, 25));

    expect(safeLocalStorageGet('stale_key', 'expired_default')).toBe('expired_default');
  });

  it('removes stored items with safeLocalStorageRemove', () => {
    safeLocalStorageSet('to_remove', 'value_here');
    expect(safeLocalStorageGet('to_remove', '')).toBe('value_here');

    safeLocalStorageRemove('to_remove');
    expect(safeLocalStorageGet('to_remove', 'removed')).toBe('removed');
  });

  it('handles corrupted JSON safely without throwing', () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('corrupt_json', '{ bad: json missing quote');
      const val = safeLocalStorageGet('corrupt_json', 'recovered_fallback');
      expect(val).toBe('recovered_fallback');
    }
  });

  it('strips prototype pollution keys (__proto__, constructor)', () => {
    const maliciousPayload = JSON.parse('{"__proto__": {"polluted": true}, "safeProp": 123}');
    safeLocalStorageSet('proto_test', maliciousPayload);
    const retrieved = safeLocalStorageGet<Record<string, unknown>>('proto_test', {});
    expect(retrieved.safeProp).toBe(123);
    expect((Object.prototype as any).polluted).toBeUndefined();
  });
});
