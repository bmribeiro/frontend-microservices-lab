import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenStorageService {
  private readonly tokenKey = 'angular_app_access_token';
  private readonly tokenSignal = signal<string | null>(this.getInitialToken());

  readonly token = this.tokenSignal.asReadonly();
  readonly hasToken = computed(() => !!this.tokenSignal());

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    this.tokenSignal.set(token);
  }

  clear(): void {
    localStorage.removeItem(this.tokenKey);
    this.tokenSignal.set(null);
  }

  private getInitialToken(): string | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }

    return localStorage.getItem(this.tokenKey);
  }
}
