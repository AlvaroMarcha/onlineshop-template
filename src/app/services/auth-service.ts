import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { createClientUser, LoginTokenResponse, User } from '../type/types';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiAuth = environment.urls.authUrl;

  constructor(private http: HttpClient) {}

  /**
   * Login con username o email y contraseña.
   * Backend: POST /auth/login
   * Request: { usernameOrEmail: string, password: string }
   * Response: AuthResponseDTO { user, token, refreshToken }
   */
  login(
    usernameOrEmail: string,
    password: string
  ): Observable<LoginTokenResponse> {
    return this.http.post<LoginTokenResponse>(
      `${this.apiAuth}/login`,
      {
        usernameOrEmail,
        password,
      }
    );
  }

  /**
   * Register (temporalmente mantiene estructura antigua).
   * TODO: adaptar a RegisterRequestDTO plano del backend.
   */
  register(
    payload: createClientUser
  ): Observable<LoginTokenResponse> {
    return this.http
      .post(`${this.apiAuth}/register`, payload)
      .pipe(
        switchMap(() =>
          this.login(payload.user.username, payload.user.password)
        )
      );
  }
}
