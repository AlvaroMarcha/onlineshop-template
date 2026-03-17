import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ProductAdmin,
  ProductCreateRequest,
  ProductUpdateRequest,
  ProductSearchParams,
  ProductAttrib,
  ProductAttribValue,
  ProductVariant,
  ProductImageAdmin,
} from '../../type/admin-types';
import { Page } from '../../type/admin-types';

@Injectable({ providedIn: 'root' })
export class AdminProductService {
  private readonly api = environment.urls.productsUrl;

  constructor(private http: HttpClient) {}

  // ── Productos ─────────────────────────────────────────────────

  searchProducts(params: ProductSearchParams = {}): Observable<Page<ProductAdmin>> {
    const queryParams: Record<string, string | number | boolean> = {
      includeInactive: params.includeInactive ?? true,
      page: params.page ?? 0,
      size: params.size ?? 20,
    };
    if (params.q)          queryParams['q']          = params.q;
    if (params.categoryId) queryParams['categoryId'] = params.categoryId;
    if (params.minPrice)   queryParams['minPrice']   = params.minPrice;
    if (params.maxPrice)   queryParams['maxPrice']   = params.maxPrice;
    if (params.featured !== undefined) queryParams['featured'] = params.featured;
    if (params.newest !== undefined)   queryParams['newest']   = params.newest;
    return this.http.get<Page<ProductAdmin>>(`${this.api}/search`, { params: queryParams as Record<string, string> });
  }

  getProductById(id: number): Observable<ProductAdmin> {
    return this.http.get<ProductAdmin>(`${this.api}/${id}`);
  }

  createProduct(payload: ProductCreateRequest): Observable<ProductAdmin> {
    return this.http.post<ProductAdmin>(this.api, payload);
  }

  updateProduct(id: number, payload: ProductUpdateRequest): Observable<ProductAdmin> {
    return this.http.put<ProductAdmin>(`${this.api}/${id}`, payload);
  }

  deleteProduct(id: number): Observable<string> {
    return this.http.delete<string>(`${this.api}/${id}`);
  }

  updateStock(id: number, stock: number): Observable<string> {
    return this.http.patch<string>(`${this.api}/${id}/stock`, { stock });
  }

  // ── Imágenes ──────────────────────────────────────────────────

  uploadImages(productId: number, files: File[]): Observable<ProductImageAdmin[]> {
    const form = new FormData();
    files.forEach(f => form.append('files', f));
    return this.http.post<ProductImageAdmin[]>(`${this.api}/${productId}/images`, form);
  }

  getImages(productId: number): Observable<ProductImageAdmin[]> {
    return this.http.get<ProductImageAdmin[]>(`${this.api}/${productId}/images`);
  }

  deleteImage(productId: number, imageId: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${productId}/images/${imageId}`);
  }

  // ── Atributos ─────────────────────────────────────────────────

  getAttribs(): Observable<ProductAttrib[]> {
    return this.http.get<ProductAttrib[]>(`${this.api}/attribs`);
  }

  createAttrib(name: string): Observable<ProductAttrib> {
    return this.http.post<ProductAttrib>(`${this.api}/attribs`, { name });
  }

  updateAttrib(id: number, name: string): Observable<ProductAttrib> {
    return this.http.put<ProductAttrib>(`${this.api}/attribs/${id}`, { name });
  }

  deleteAttrib(id: number): Observable<string> {
    return this.http.delete<string>(`${this.api}/attribs/${id}`);
  }

  createAttribValue(attribId: number, value: string): Observable<ProductAttribValue> {
    return this.http.post<ProductAttribValue>(`${this.api}/attribs/${attribId}/values`, { value });
  }

  updateAttribValue(valueId: number, value: string): Observable<ProductAttribValue> {
    return this.http.put<ProductAttribValue>(`${this.api}/attribs/values/${valueId}`, { value });
  }

  deleteAttribValue(valueId: number): Observable<string> {
    return this.http.delete<string>(`${this.api}/attribs/values/${valueId}`);
  }

  // ── Variantes ─────────────────────────────────────────────────

  getVariants(productId: number): Observable<ProductVariant[]> {
    return this.http.get<ProductVariant[]>(`${this.api}/${productId}/variants`);
  }
}
