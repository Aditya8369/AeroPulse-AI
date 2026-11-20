/**
 * Robust LocalStorage wrapper with TTL, schema validation, prototype pollution defense, and quota fallback
 */

interface StorageEnvelope<T> {
  data: T;
  timestamp: number;
  ttlMs?: number;
}

const memoryStore: Record<string, string> = {};

function isObject(val: unknown): val is Record<string, unknown> {
  return typeof val === 'object' && val !== null && !Array.isArray(val);
}

/**
 * Strips dangerous prototype pollution keys (__proto__, constructor, prototype)
 */
function sanitizeParsedObject<T>(obj: T): T {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeParsedObject(item)) as unknown as T;
  }
  const clean: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      continue;
    }
    clean[key] = sanitizeParsedObject(value);
  }
  return clean as unknown as T;
}

export function safeLocalStorageGet<T>(key: string, defaultValue: T): T {
  try {
    const hasLocalStorage = typeof window !== 'undefined' && 
      !!window.localStorage && 
      typeof window.localStorage.getItem === 'function';

    const raw = hasLocalStorage 
      ? window.localStorage.getItem(key) 
      : memoryStore[key];

    if (!raw) return defaultValue;

    const parsed = JSON.parse(raw);

    // Validate envelope structure
    if (isObject(parsed) && 'timestamp' in parsed && 'data' in parsed) {
      const envelope = parsed as unknown as StorageEnvelope<T>;
      if (typeof envelope.ttlMs === 'number' && Date.now() - envelope.timestamp > envelope.ttlMs) {
        safeLocalStorageRemove(key);
        return defaultValue;
      }
      return sanitizeParsedObject(envelope.data);
    }

    return sanitizeParsedObject(parsed as unknown as T);
  } catch {
    return defaultValue;
  }
}

export function safeLocalStorageSet<T>(key: string, data: T, ttlMs?: number): boolean {
  try {
    const envelope: StorageEnvelope<T> = {
      data,
      timestamp: Date.now(),
      ttlMs
    };
    const serialized = JSON.stringify(envelope);

    const hasLocalStorage = typeof window !== 'undefined' && 
      !!window.localStorage && 
      typeof window.localStorage.setItem === 'function';

    if (hasLocalStorage) {
      window.localStorage.setItem(key, serialized);
    } else {
      memoryStore[key] = serialized;
    }
    return true;
  } catch {
    // Quota exceeded or storage blocked: fallback to in-memory store
    try {
      memoryStore[key] = JSON.stringify({ data, timestamp: Date.now() });
    } catch {
      // Ignore memory store failure
    }
    return false;
  }
}

export function safeLocalStorageRemove(key: string): void {
  try {
    const hasLocalStorage = typeof window !== 'undefined' && 
      !!window.localStorage && 
      typeof window.localStorage.removeItem === 'function';

    if (hasLocalStorage) {
      window.localStorage.removeItem(key);
    }
    delete memoryStore[key];
  } catch {
    // Ignore error
  }
}

export function safeLocalStorageClear(): void {
  try {
    const hasLocalStorage = typeof window !== 'undefined' && 
      !!window.localStorage && 
      typeof window.localStorage.clear === 'function';

    if (hasLocalStorage) {
      window.localStorage.clear();
    }
    Object.keys(memoryStore).forEach(k => delete memoryStore[k]);
  } catch {
    // Ignore error
  }
}
