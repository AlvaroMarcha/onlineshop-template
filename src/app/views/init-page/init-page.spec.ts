import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { InitPage } from './init-page';
import { LanguageService } from '../../services/language-service';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { allProductsRequestInit } from '../../store/products/products.actions';
import { addToCart } from '../../store/cart/cart.actions';

describe('InitPage', () => {
  let component: InitPage;
  let fixture: ComponentFixture<InitPage>;
  let router: jasmine.SpyObj<Router>;
  let languageService: jasmine.SpyObj<LanguageService>;
  let store: jasmine.SpyObj<Store>;

  const mockProducts = [
    {
      id: 1,
      name: 'Product 1',
      description: 'Description 1',
      urlImg: 'https://example.com/img1.jpg',
      price: 100,
      stock: 10,
      bar_code: '123',
      reference: 'REF1',
      visible: true,
      category: 'Category 1',
      subcategory: 'Subcategory 1',
    },
    {
      id: 2,
      name: 'Product 2',
      description: 'Description 2',
      urlImg: 'https://example.com/img2.jpg',
      price: 200,
      stock: 5,
      bar_code: '456',
      reference: 'REF2',
      visible: true,
      category: 'Category 2',
      subcategory: 'Subcategory 2',
    },
  ];

  beforeEach(async () => {
    const languageServiceSpy = jasmine.createSpyObj('LanguageService', ['tMany']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const storeSpy = jasmine.createSpyObj('Store', ['select', 'dispatch']);

    // Mock store select to return products
    storeSpy.select.and.returnValue(of(mockProducts));

    await TestBed.configureTestingModule({
      imports: [InitPage, TranslateModule.forRoot()],
      providers: [
        { provide: LanguageService, useValue: languageServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: Store, useValue: storeSpy },
        TranslateService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InitPage);
    component = fixture.componentInstance;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    languageService = TestBed.inject(LanguageService) as jasmine.SpyObj<LanguageService>;
    store = TestBed.inject(Store) as jasmine.SpyObj<Store>;
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have categories defined', () => {
    expect(component.categories).toBeDefined();
    expect(component.categories.length).toBeGreaterThan(0);
  });

  it('should have features defined', () => {
    expect(component.features).toBeDefined();
    expect(component.features.length).toBeGreaterThan(0);
  });

  it('should dispatch allProductsRequestInit on init', () => {
    expect(store.dispatch).toHaveBeenCalledWith(allProductsRequestInit());
  });

  it('should return featured products (first 6)', () => {
    const featured = component.featuredProducts();
    expect(featured).toBeDefined();
    expect(featured.length).toBe(2); // Solo hay 2 productos en mock
  });

  it('should navigate to shop when goToShop is called', () => {
    component.goToShop();
    expect(router.navigate).toHaveBeenCalledWith(['/shop']);
  });

  it('should navigate to register when goToRegister is called', () => {
    component.goToRegister();
    expect(router.navigate).toHaveBeenCalledWith(['/register']);
  });

  it('should navigate to product detail when goToProduct is called', () => {
    const productId = 1;
    component.goToProduct(productId);
    expect(router.navigate).toHaveBeenCalledWith(['/product', productId]);
  });

  it('should dispatch addToCart when addToCart is called with valid product', () => {
    const productId = 1;
    
    component.addToCart(productId);
    
    expect(store.dispatch).toHaveBeenCalledWith(
      addToCart({
        item: {
          id: 1,
          name: 'Product 1',
          price: 100,
          imageUrl: 'https://example.com/img1.jpg',
          quantity: 1,
          category: 'Category 1',
        },
      })
    );
  });

  it('should not dispatch addToCart when product not found', () => {
    const initialCallCount = store.dispatch.calls.count();
    
    component.addToCart(999); // Non-existent product
    
    // Debería tener el mismo número de llamadas (solo el allProductsRequestInit del ngOnInit)
    expect(store.dispatch.calls.count()).toBe(initialCallCount);
  });
});
