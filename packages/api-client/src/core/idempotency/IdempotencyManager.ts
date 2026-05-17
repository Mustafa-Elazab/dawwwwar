import { IdempotencyStorage, IDEMPOTENT_ENDPOINTS } from './idempotency.constants';

export class IdempotencyManager {
  private storage: IdempotencyStorage | null = null;
  private readonly STORAGE_PREFIX = 'idempotency_key:';

  setStorage(storage: IdempotencyStorage) {
    this.storage = storage;
  }

  /**
   * Generates or retrieves a persistent idempotency key for a specific request.
   * Key is tied to (method + endpoint + body_fingerprint).
   */
  getOrCreateKey(url: string, method: string, body: any): string | null {
    if (!this.isIdempotentEndpoint(url, method)) {
      return null;
    }

    const fingerprint = this.generateFingerprint(url, method, body);
    const storageKey = `${this.STORAGE_PREFIX}${fingerprint}`;

    // 1. Try to get existing key (survives app restart)
    const storedValue = this.storage?.getItem(storageKey);
    if (storedValue) {
      try {
        const { key } = JSON.parse(storedValue);
        if (__DEV__) console.log(`[Idempotency] Reusing key: ${key} for ${method} ${url}`);
        return key;
      } catch {
        // Fallback if storage is corrupted
      }
    }

    // 2. Generate new UUID
    const newKey = this.generateUUID();
    
    // 3. Persist BEFORE request
    const payload = JSON.stringify({
      key: newKey,
      timestamp: Date.now(),
      url,
      method,
    });
    
    this.storage?.setItem(storageKey, payload);
    
    if (__DEV__) console.log(`[Idempotency] Generated & Persisted key: ${newKey} for ${method} ${url}`);
    return newKey;
  }

  /**
   * Clears the persisted key after a confirmed success or backend-driven finality.
   */
  clearKey(url: string, method: string, body: any) {
    const fingerprint = this.generateFingerprint(url, method, body);
    const storageKey = `${this.STORAGE_PREFIX}${fingerprint}`;
    this.storage?.removeItem(storageKey);
    
    if (__DEV__) console.log(`[Idempotency] Cleared key for ${method} ${url}`);
  }

  private isIdempotentEndpoint(url: string, method: string): boolean {
    const normalizedMethod = method.toUpperCase();
    if (normalizedMethod !== 'POST' && normalizedMethod !== 'PATCH' && normalizedMethod !== 'PUT') {
      return false;
    }

    // Exact match or parameterized path match
    return IDEMPOTENT_ENDPOINTS.some(endpoint => {
      const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
      
      if (normalizedEndpoint.includes(':id')) {
        const pattern = normalizedEndpoint.replace(/:id/g, '[^/]+');
        const regex = new RegExp(`^${pattern}$`);
        return regex.test(url) || url.endsWith(normalizedEndpoint.split('/:id')[0]);
      }
      
      return url.endsWith(normalizedEndpoint);
    });
  }

  private generateFingerprint(url: string, method: string, body: any): string {
    // Stable stringification for body
    const bodyStr = body ? JSON.stringify(body) : '';
    // Simple but unique enough for local storage keys
    return `${method}:${url}:${bodyStr}`;
  }

  private generateUUID(): string {
    // Basic UUID generator for browser/RN compatibility
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}

export const idempotencyManager = new IdempotencyManager();
