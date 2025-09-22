import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginTokenResponse, User } from '../type/types';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiAuth = environment.urls.authUrl;

  constructor(private http: HttpClient) {}

  login(
    username: string,
    password: string
  ): Observable<{ user: User; token: string }> {
    return this.http.post<{ user: User; token: string }>(
      `${this.apiAuth}/login`,
      {
        user: username,
        pass: password,
      }
    );
  }
}
