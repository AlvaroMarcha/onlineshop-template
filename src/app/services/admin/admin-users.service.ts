import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  BannedUserResponse,
  Page,
  UserAdmin,
  UserSearchParams,
} from '../../type/admin-types';

@Injectable({ providedIn: 'root' })
export class AdminUsersService {
  private readonly api = environment.urls.usersUrl;

  constructor(private http: HttpClient) {}

  // ── Listado ───────────────────────────────────────────────────

  getUsersForAdmin(params: UserSearchParams): Observable<Page<UserAdmin>> {
    return this.http.get<Page<UserAdmin>>(this.api, {
      params: {
        page: params.page.toString(),
        size: params.size.toString(),
      },
    });
  }

  // ── Detalle ───────────────────────────────────────────────────

  getUserById(id: number): Observable<UserAdmin> {
    return this.http.get<UserAdmin>(`${this.api}/${id}`);
  }

  // ── Acciones ──────────────────────────────────────────────────

  banUser(id: number): Observable<BannedUserResponse> {
    return this.http.put<BannedUserResponse>(`${this.api}/${id}/ban`, null);
  }

  unbanUser(id: number): Observable<BannedUserResponse> {
    return this.http.put<BannedUserResponse>(`${this.api}/${id}/unban`, null);
  }
}
