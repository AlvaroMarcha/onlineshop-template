import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AdminCatalogService } from './admin-catalog.service';
import { environment } from '../../../environments/environment';
import {
  CategoryAdmin,
  CategoryCreateRequest,
  SubcategoryAdmin,
  SubcategoryCreateRequest,
} from '../../type/admin-types';

describe('AdminCatalogService', () => {
  let service: AdminCatalogService;
  let httpMock: HttpTestingController;

  const categoriesApi   = environment.urls.categoriesUrl;
  const subcategoriesApi = `${categoriesApi}/subcategories`;

  const mockSubcategory: SubcategoryAdmin = { id: 10, name: 'Sub A', slug: 'sub-a', active: true };
  const mockCategory: CategoryAdmin = {
    id: 1, name: 'Cat A', slug: 'cat-a', active: true,
    subcategories: [mockSubcategory],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service  = TestBed.inject(AdminCatalogService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // ── Categorías ───────────────────────────────────────────────

  it('getCategories() should GET /categories', () => {
    service.getCategories().subscribe(cats => expect(cats).toEqual([mockCategory]));
    const req = httpMock.expectOne(categoriesApi);
    expect(req.request.method).toBe('GET');
    req.flush([mockCategory]);
  });

  it('getCategoryById() should GET /categories/{id}', () => {
    service.getCategoryById(1).subscribe(cat => expect(cat).toEqual(mockCategory));
    const req = httpMock.expectOne(`${categoriesApi}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCategory);
  });

  it('createCategory() should POST /categories', () => {
    const payload: CategoryCreateRequest = { name: 'Cat B', slug: 'cat-b' };
    service.createCategory(payload).subscribe(cat => expect(cat).toEqual(mockCategory));
    const req = httpMock.expectOne(categoriesApi);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(mockCategory);
  });

  it('updateCategory() should PUT /categories/{id}', () => {
    const payload = { name: 'Cat Updated' };
    service.updateCategory(1, payload).subscribe(cat => expect(cat).toEqual(mockCategory));
    const req = httpMock.expectOne(`${categoriesApi}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);
    req.flush(mockCategory);
  });

  it('deleteCategory() should DELETE /categories/{id}', () => {
    service.deleteCategory(1).subscribe();
    const req = httpMock.expectOne(`${categoriesApi}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  // ── Subcategorías ─────────────────────────────────────────────

  it('createSubcategory() should POST /categories/subcategories', () => {
    const payload: SubcategoryCreateRequest = { name: 'Sub B', slug: 'sub-b', categoryId: 1 };
    service.createSubcategory(payload).subscribe(sub => expect(sub).toEqual(mockSubcategory));
    const req = httpMock.expectOne(subcategoriesApi);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(mockSubcategory);
  });

  it('updateSubcategory() should PUT /categories/subcategories/{id}', () => {
    const payload = { name: 'Sub Updated' };
    service.updateSubcategory(10, payload).subscribe(sub => expect(sub).toEqual(mockSubcategory));
    const req = httpMock.expectOne(`${subcategoriesApi}/10`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);
    req.flush(mockSubcategory);
  });

  it('deleteSubcategory() should DELETE /categories/subcategories/{id}', () => {
    service.deleteSubcategory(10).subscribe();
    const req = httpMock.expectOne(`${subcategoriesApi}/10`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
