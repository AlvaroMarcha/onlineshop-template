import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginTokenResponse, RegisterRequest } from '../type/types';
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
   * Register de nuevo usuario.
   * Backend: POST /auth/register
   * Request: RegisterRequestDTO
   * Response: AuthResponseDTO { user, token, refreshToken }
   */
  register(payload: RegisterRequest): Observable<LoginTokenResponse> {
    return this.http.post<LoginTokenResponse>(
      `${this.apiAuth}/register`,
      payload
    );
  }
}
