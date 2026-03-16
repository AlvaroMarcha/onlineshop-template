import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Address } from '../type/types';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AddressService {
  private apiUrl = environment.urls.addressUrl;

  constructor(private http: HttpClient) {}

  /**
   * Obtener todas las direcciones de un usuario.
   * Backend: GET /address/{userId}
   * Response: List<AddressResponseDTO>
   */
  getAddressesByUser(userId: number): Observable<Address[]> {
    return this.http.get<Address[]>(`${this.apiUrl}/${userId}`);
  }

  /**
   * Crear nueva dirección.
   * Backend: POST /address
   * Request: Address (sin id)
   * Response: AddressResponseDTO
   */
  createAddress(address: Address): Observable<Address> {
    return this.http.post<Address>(this.apiUrl, address);
  }

  /**
   * Actualizar dirección existente.
   * Backend: PUT /address
   * Request: Address (con id)
   * Response: AddressResponseDTO
   */
  updateAddress(address: Address): Observable<Address> {
    return this.http.put<Address>(this.apiUrl, address);
  }

  /**
   * Eliminar dirección por ID.
   * Backend: DELETE /address/{id}
   * Response: String con mensaje de confirmación
   */
  deleteAddress(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
  }
}
