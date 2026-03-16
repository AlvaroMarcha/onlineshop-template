import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUsersUrl = environment.urls.usersUrl;

  constructor(private http: HttpClient) {}

  /**
   * Sube una imagen de perfil para un usuario.
   * Backend: POST /users/upload/{id}
   * Request: FormData con campo 'file' (MultipartFile)
   * Response: String (URL de la imagen subida)
   */
  uploadProfileImage(userId: number, file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<string>(
      `${this.apiUsersUrl}/upload/${userId}`,
      formData,
      { responseType: 'text' as 'json' } // Backend retorna String directamente
    );
  }
}
