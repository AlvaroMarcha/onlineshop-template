import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CategoryAdmin,
  CategoryCreateRequest,
  SubcategoryAdmin,
  SubcategoryCreateRequest,
} from '../../type/admin-types';

@Injectable({ providedIn: 'root' })
export class AdminCatalogService {
  private readonly categoriesApi   = environment.urls.categoriesUrl;
  private readonly subcategoriesApi = `${this.categoriesApi}/subcategories`;

  constructor(private http: HttpClient) {}

  // ── Categorías ────────────────────────────────────────────────

  getCategories(): Observable<CategoryAdmin[]> {
    return this.http.get<CategoryAdmin[]>(this.categoriesApi);
  }

  getCategoryById(id: number): Observable<CategoryAdmin> {
    return this.http.get<CategoryAdmin>(`${this.categoriesApi}/${id}`);
  }

  createCategory(payload: CategoryCreateRequest): Observable<CategoryAdmin> {
    return this.http.post<CategoryAdmin>(this.categoriesApi, payload);
  }

  updateCategory(id: number, payload: Partial<CategoryCreateRequest>): Observable<CategoryAdmin> {
    return this.http.put<CategoryAdmin>(`${this.categoriesApi}/${id}`, payload);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.categoriesApi}/${id}`);
  }

  // ── Subcategorías ─────────────────────────────────────────────

  createSubcategory(payload: SubcategoryCreateRequest): Observable<SubcategoryAdmin> {
    return this.http.post<SubcategoryAdmin>(this.subcategoriesApi, payload);
  }

  updateSubcategory(id: number, payload: Partial<SubcategoryCreateRequest>): Observable<SubcategoryAdmin> {
    return this.http.put<SubcategoryAdmin>(`${this.subcategoriesApi}/${id}`, payload);
  }

  deleteSubcategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.subcategoriesApi}/${id}`);
  }
}
