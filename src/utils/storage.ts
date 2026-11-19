/**
 * Robust LocalStorage wrapper with TTL and quota fallback
 */

interface StorageEnvelope<T> {
  data: T;
  timestamp: number;
  ttlMs?: number;
}

const memoryStore: Record<string, string> = {};

export function safeLocalStorageGet<T>(key: string, defaultValue: T): T {
  try {
    const hasLocalStorage = typeof window !== 'undefined' && 
      window.localStorage && 
      typeof window.localStorage.getItem === 'function';

    const raw = hasLocalStorage 
      ? window.localStorage.getItem(key) 
      : memoryStore[key];

    if (!raw) return defaultValue;

    const parsed: StorageEnvelope<T> = JSON.parse(raw);
    if (parsed.ttlMs && Date.now() - parsed.timestamp > parsed.ttlMs) {
      safeLocalStorageRemove(key);
      return defaultValue;
    }
    return parsed.data !== undefined ? parsed.data : (parsed as unknown as T);
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
      window.localStorage && 
      typeof window.localStorage.setItem === 'function';

    if (hasLocalStorage) {
      window.localStorage.setItem(key, serialized);
    } else {
      memoryStore[key] = serialized;
    }
    return true;
  } catch {
    memoryStore[key] = JSON.stringify({ data, timestamp: Date.now() });
    return false;
  }
}

export function safeLocalStorageRemove(key: string): void {
  try {
    const hasLocalStorage = typeof window !== 'undefined' && 
      window.localStorage && 
      typeof window.localStorage.removeItem === 'function';

    if (hasLocalStorage) {
      window.localStorage.removeItem(key);
    }
    delete memoryStore[key];
  } catch {
    // Ignore error
  }
}
