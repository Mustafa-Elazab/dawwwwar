export interface TokenStorage {
  getAccessToken(): string | null;
  setAccessToken(token: string): void;
  getRefreshToken(): string | null;
  setRefreshToken(token: string): void;
  clearTokens(): void;
}

class TokenManager {
  private storage: TokenStorage | null = null;

  setStorage(storage: TokenStorage) {
    this.storage = storage;
  }

  get accessToken() {
    return this.storage?.getAccessToken() || null;
  }

  set accessToken(token: string | null) {
    if (token) this.storage?.setAccessToken(token);
    else this.storage?.clearTokens();
  }

  get refreshToken() {
    return this.storage?.getRefreshToken() || null;
  }

  set refreshToken(token: string | null) {
    if (token) this.storage?.setRefreshToken(token);
  }

  clear() {
    this.storage?.clearTokens();
  }
}

export const tokenManager = new TokenManager();
