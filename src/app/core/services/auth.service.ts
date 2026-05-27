import { Injectable, inject } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { API_PATHS } from '../constants/api-paths.constant';
import { STORAGE_KEYS } from '../constants/storage-keys.constant';
import { RegisterRequestBody } from '../models/register-request.model';
import { ApiService } from './api.service';

/** Respuesta del API: token en raíz o bajo `data` (formato actual del backend). */
interface AuthTokenResponse {
  access_token?: string;
  token?: string;
  access?: string;
  data?: {
    access_token?: string;
    token?: string;
    access?: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly api = inject(ApiService);

  login(email: string, password: string): Observable<void> {
    return this.api.post<AuthTokenResponse>(API_PATHS.authLogin, { email, password }).pipe(
      tap((res) => this.persistTokenFromResponse(res)),
      map(() => undefined)
    );
  }

  register(payload: RegisterRequestBody): Observable<void> {
    return this.api.post<AuthTokenResponse>(API_PATHS.authRegister, payload).pipe(
      tap((res) => this.persistTokenFromResponse(res)),
      map(() => undefined)
    );
  }

  getToken(): string | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }
    const raw = localStorage.getItem(STORAGE_KEYS.authToken);
    return raw && raw.trim() ? raw : null;
  }

  logout(): void {
    if (typeof localStorage === 'undefined') {
      return;
    }
    localStorage.removeItem(STORAGE_KEYS.authToken);
  }

  isAuthenticated(): boolean {
    return this.getToken() != null;
  }

  private persistTokenFromResponse(res: AuthTokenResponse): void {
    const token =
      res.access_token ??
      res.token ??
      res.access ??
      res.data?.access_token ??
      res.data?.token ??
      res.data?.access;
    if (token && typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.authToken, token);
    }
  }
}
