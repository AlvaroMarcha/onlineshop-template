import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../type/types';

@Injectable({
  providedIn: 'root',
})
export class ProductServices {
  private apiProducts = environment.urls.productsUrl;

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiProducts);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiProducts}/${id}`);
  }
}
