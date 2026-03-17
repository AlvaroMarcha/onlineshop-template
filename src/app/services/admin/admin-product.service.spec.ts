import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { AdminProductService } from './admin-product.service';
import { environment } from '../../../environments/environment';
import {
  ProductAdmin,
  ProductCreateRequest,
  ProductUpdateRequest,
  Page,
} from '../../type/admin-types';

describe('AdminProductService', () => {
  let service: AdminProductService;
  let httpMock: HttpTestingController;
  const api = environment.urls.productsUrl;

  const mockProduct: ProductAdmin = {
    id: 1,
    name: 'Test Product',
    sku: 'SKU-001',
    description: 'Test',
    price: 99.99,
    discountPrice: null,
    taxRate: 21,
    categories: [],
    weight: 0.5,
    isDigital: false,
    isFeatured: false,
    slug: 'test-product',
    metaTitle: null,
    metaDescription: null,
    rating: 0,
    ratingCount: 0,
    soldCount: 0,
    stock: 10,
    lowStockThreshold: 3,
    isActive: true,
    mainImageUrl: null,
    images: [],
    attribs: [],
    variants: [],
  };

  const mockPage: Page<ProductAdmin> = {
    content: [mockProduct],
    totalElements: 1,
    totalPages: 1,
    number: 0,
    size: 20,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service  = TestBed.inject(AdminProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('searchProducts()', () => {
    it('calls GET /products/search with default params', () => {
      service.searchProducts().subscribe(page => expect(page).toEqual(mockPage));

      const req = httpMock.expectOne(r => r.url === `${api}/search`);
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('includeInactive')).toBe('true');
      expect(req.request.params.get('page')).toBe('0');
      expect(req.request.params.get('size')).toBe('20');
      req.flush(mockPage);
    });

    it('passes query string when provided', () => {
      service.searchProducts({ q: 'zapatilla', page: 1, size: 10 }).subscribe();

      const req = httpMock.expectOne(r => r.url === `${api}/search`);
      expect(req.request.params.get('q')).toBe('zapatilla');
      expect(req.request.params.get('page')).toBe('1');
      req.flush(mockPage);
    });
  });

  describe('getProductById()', () => {
    it('calls GET /products/1', () => {
      service.getProductById(1).subscribe(p => expect(p).toEqual(mockProduct));

      const req = httpMock.expectOne(`${api}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockProduct);
    });
  });

  describe('createProduct()', () => {
    it('calls POST /products', () => {
      const payload: ProductCreateRequest = {
        name: 'New', sku: 'SKU-002', description: 'Desc', price: 10,
        discountPrice: null, taxRate: 21, weight: null, isDigital: false,
        isFeatured: false, slug: 'new', metaTitle: null, metaDescription: null,
        lowStockThreshold: 2, stock: 5, categoryIds: []
      };
      service.createProduct(payload).subscribe(p => expect(p).toEqual(mockProduct));

      const req = httpMock.expectOne(api);
      expect(req.request.method).toBe('POST');
      req.flush(mockProduct);
    });
  });

  describe('updateProduct()', () => {
    it('calls PUT /products/1', () => {
      const payload: ProductUpdateRequest = { name: 'Updated', price: 49.99 };
      service.updateProduct(1, payload).subscribe(p => expect(p).toEqual(mockProduct));

      const req = httpMock.expectOne(`${api}/1`);
      expect(req.request.method).toBe('PUT');
      req.flush(mockProduct);
    });
  });

  describe('deleteProduct()', () => {
    it('calls DELETE /products/1', () => {
      service.deleteProduct(1).subscribe(msg => expect(msg).toBe('ok'));

      const req = httpMock.expectOne(`${api}/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush('ok');
    });
  });

  describe('uploadImages()', () => {
    it('calls POST /products/1/images with FormData', () => {
      const file = new File([''], 'img.jpg', { type: 'image/jpeg' });
      service.uploadImages(1, [file]).subscribe(imgs => expect(imgs).toEqual([]));

      const req = httpMock.expectOne(`${api}/1/images`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body instanceof FormData).toBeTrue();
      req.flush([]);
    });
  });

  describe('getImages()', () => {
    it('calls GET /products/1/images', () => {
      service.getImages(1).subscribe(imgs => expect(imgs).toEqual([]));

      const req = httpMock.expectOne(`${api}/1/images`);
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });
  });

  describe('getAttribs()', () => {
    it('calls GET /products/attribs', () => {
      service.getAttribs().subscribe(a => expect(a).toEqual([]));

      const req = httpMock.expectOne(`${api}/attribs`);
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });
  });

  describe('getVariants()', () => {
    it('calls GET /products/1/variants', () => {
      service.getVariants(1).subscribe(v => expect(v).toEqual([]));

      const req = httpMock.expectOne(`${api}/1/variants`);
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });
  });
});
