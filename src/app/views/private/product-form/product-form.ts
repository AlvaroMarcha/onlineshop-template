import {
  Component, ChangeDetectionStrategy, inject, signal, computed, OnInit, OnDestroy,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import {
  MCard, MButton, MIcon, MInput, MTextarea, MNumberInput, MFloatLabel,
  MMessage, MToggleSwitch, MTabs, MTabPanel, MChip, MDialog, MDivider,
  type MTabItem,
} from '../../../components/marcha';
import {
  adminProductLoad, adminProductCreate, adminProductUpdate,
  adminProductClear, adminProductsLoadAttribs,
} from '../../../store/admin/products/admin-products.actions';
import {
  selectAdminProductSelected, selectAdminProductAttribs,
  selectAdminProductLoading, selectAdminProductSaving, selectAdminProductError,
} from '../../../store/admin/products/admin-products.selectors';
import { ProductCreateRequest, ProductImageAdmin } from '../../../type/admin-types';
import { DatePipe } from '@angular/common';

type Category = { id: number; name: string; slug: string };

@Component({
  selector: 'app-product-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslateModule, ReactiveFormsModule, DatePipe,
    MCard, MButton, MIcon, MInput, MTextarea, MNumberInput, MFloatLabel,
    MMessage, MToggleSwitch, MTabs, MTabPanel, MChip, MDialog, MDivider,
  ],
  templateUrl: './product-form.html',
  styleUrl:    './product-form.css',
})
export class ProductForm implements OnInit, OnDestroy {
  private store     = inject(Store);
  private route     = inject(ActivatedRoute);
  private router    = inject(Router);
  private translate = inject(TranslateService);
  private destroy$  = new Subject<void>();

  // ── Modo ──────────────────────────────────────────────────────
  readonly productId = signal<number | null>(null);
  readonly isEdit    = computed(() => this.productId() !== null);
  readonly editing   = signal(false);

  // ── Store ─────────────────────────────────────────────────────
  readonly selected = toSignal(this.store.select(selectAdminProductSelected));
  readonly attribs  = toSignal(this.store.select(selectAdminProductAttribs), { initialValue: [] });
  readonly loading  = toSignal(this.store.select(selectAdminProductLoading), { initialValue: false });
  readonly saving   = toSignal(this.store.select(selectAdminProductSaving),  { initialValue: false });
  readonly error    = toSignal(this.store.select(selectAdminProductError));

  // ── Tabs ──────────────────────────────────────────────────────
  readonly activeTab = signal(0);
  // TabItems se construyen dinámicamente en ngOnInit con traducciones
  readonly tabItems = signal<MTabItem[]>([]);

  // ── Gallery ───────────────────────────────────────────────────
  readonly images = signal<ProductImageAdmin[]>([]);
  readonly uploadingImages = signal(false);
  readonly mainImage = computed(() => this.images().find(img => img.isMain)?.url || null);

  // ── Categories ────────────────────────────────────────────────
  readonly selectedCategories = signal<Category[]>([]);
  readonly showCategoryDialog = signal(false);
  readonly availableCategories = signal<Category[]>([]); // TODO: cargar desde store

  // ── Dialogs ───────────────────────────────────────────────────
  readonly showCancelDialog = signal(false);
  readonly showDeleteImageDialog = signal(false);
  readonly imageToDelete = signal<number | null>(null);

  // ── Formulario ────────────────────────────────────────────────
  readonly form = new FormGroup({
    name:               new FormControl('',          { nonNullable: true, validators: [Validators.required, Validators.minLength(2)] }),
    description:        new FormControl('',          { nonNullable: true }),
    price:              new FormControl<number>(0,   { nonNullable: true, validators: [Validators.required, Validators.min(0)] }),
    discountPrice:      new FormControl<number | null>(null, { validators: [Validators.min(0)] }),
    taxRate:            new FormControl<number>(21,  { nonNullable: true, validators: [Validators.required, Validators.min(0)] }),
    stock:              new FormControl<number>(0,   { nonNullable: true, validators: [Validators.required, Validators.min(0)] }),
    lowStockThreshold:  new FormControl<number>(3,   { nonNullable: true, validators: [Validators.min(0)] }),
    weight:             new FormControl<number | null>(null, { validators: [Validators.min(0)] }),
    isDigital:          new FormControl(false,       { nonNullable: true }),
    isFeatured:         new FormControl(false,       { nonNullable: true }),
    isActive:           new FormControl(true,        { nonNullable: true }),
    metaTitle:          new FormControl<string | null>(null),
    metaDescription:    new FormControl<string | null>(null),
  });

  ngOnInit() {
    // Construir tab items con traducciones (se actualizarán automáticamente si cambia el idioma)
    this.tabItems.set([
      { label: this.translate.instant('admin.product_form.basic_tab'),   icon: 'lucide:package' },
      { label: this.translate.instant('admin.product_form.pricing_tab'), icon: 'lucide:banknote' },
      { label: this.translate.instant('admin.product_form.stock_tab'),   icon: 'lucide:warehouse' },
      { label: this.translate.instant('admin.product_form.seo_tab'),     icon: 'lucide:search' },
      { label: this.translate.instant('admin.product_form.media_tab'),   icon: 'lucide:image' },
    ]);

    this.store.dispatch(adminProductsLoadAttribs());

    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      const numId = +id;
      this.productId.set(numId);
      this.store.dispatch(adminProductLoad({ id: numId }));
    }

    // Sincronizar el formulario cuando se carga el producto seleccionado
    this.store.select(selectAdminProductSelected)
      .pipe(takeUntil(this.destroy$))
      .subscribe(product => {
        if (product && this.isEdit()) {
          this.form.patchValue({
            name:              product.name,
            description:       product.description ?? '',
            price:             product.price,
            discountPrice:     product.discountPrice,
            taxRate:           product.taxRate,
            stock:             product.stock,
            lowStockThreshold: product.lowStockThreshold,
            weight:            product.weight,
            isDigital:         product.isDigital,
            isFeatured:        product.isFeatured,
            isActive:          product.isActive,
            metaTitle:         product.metaTitle,
            metaDescription:   product.metaDescription,
          });
          // Cargar imágenes y categorías
          this.images.set(product.images || []);
          this.selectedCategories.set(product.categories || []);

          if (!this.editing()) {
            this.form.disable();
          }
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.store.dispatch(adminProductClear());
  }

  // ── Actions ──────────────────────────────────────────────────
  goBack() {
    this.router.navigate(['/admin/products']);
  }

  submit() {
    if (this.isEdit() && !this.editing()) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const payload: ProductCreateRequest = {
      name:              raw.name,
      description:       raw.description,
      price:             raw.price,
      discountPrice:     raw.discountPrice,
      taxRate:           raw.taxRate,
      stock:             raw.stock,
      lowStockThreshold: raw.lowStockThreshold,
      weight:            raw.weight,
      isDigital:         raw.isDigital,
      isFeatured:        raw.isFeatured,
      metaTitle:         raw.metaTitle,
      metaDescription:   raw.metaDescription,
      categoryIds:       this.selectedCategories().map(c => c.id),
    };

    const id = this.productId();
    if (id !== null) {
      this.store.dispatch(adminProductUpdate({ id, payload }));
    } else {
      this.store.dispatch(adminProductCreate({ payload }));
    }
  }

  cancel() {
    if (this.isEdit() && this.editing() && this.form.dirty) {
      this.showCancelDialog.set(true);
    } else {
      this.cancelEditing();
    }
  }

  confirmCancel() {
    this.showCancelDialog.set(false);
    this.cancelEditing();
  }

  private cancelEditing(): void {
    if (!this.isEdit()) {
      // Si es creación, volver a la lista
      this.router.navigate(['/admin/products']);
      return;
    }

    // Si es edición, resetear el formulario y salir del modo edición
    const product = this.selected();
    if (product) {
      this.form.patchValue({
        name:              product.name,
        description:       product.description ?? '',
        price:             product.price,
        discountPrice:     product.discountPrice,
        taxRate:           product.taxRate,
        stock:             product.stock,
        lowStockThreshold: product.lowStockThreshold,
        weight:            product.weight,
        isDigital:         product.isDigital,
        isFeatured:        product.isFeatured,
        isActive:          product.isActive,
        metaTitle:         product.metaTitle,
        metaDescription:   product.metaDescription,
      });
      this.images.set(product.images || []);
      this.selectedCategories.set(product.categories || []);
    }
    this.editing.set(false);
    this.form.disable();
  }

  startEditing(): void {
    this.editing.set(true);
    this.form.enable();
  }

  // ── Gallery ───────────────────────────────────────────────────
  onFileSelect(event: Event): void {
    if (!this.editing()) return;
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    // TODO: implementar subida real vía API
    // POST /products/{productId}/images con FormData
    this.uploadingImages.set(true);
    console.log('Subiendo imágenes...', input.files);
    // Simular subida
    setTimeout(() => {
      this.uploadingImages.set(false);
      input.value = '';
    }, 1000);
  }

  deleteImage(imageId: number): void {
    if (!this.editing()) return;
    this.imageToDelete.set(imageId);
    this.showDeleteImageDialog.set(true);
  }

  confirmDeleteImage(): void {
    const id = this.imageToDelete();
    if (id === null) return;

    // TODO: DELETE /products/{productId}/images/{imageId}
    console.log('Eliminando imagen...', id);
    this.images.update(imgs => imgs.filter(img => img.id !== id));
    this.showDeleteImageDialog.set(false);
    this.imageToDelete.set(null);
  }

  setMainImage(imageId: number): void {
    if (!this.editing()) return;
    // TODO: PUT /products/{productId}/images/{imageId} con { isMain: true }
    console.log('Estableciendo imagen principal...', imageId);
    this.images.update(imgs =>
      imgs.map(img => ({ ...img, isMain: img.id === imageId }))
    );
  }

  // ── Categories ────────────────────────────────────────────────
  removeCategory(categoryId: number): void {
    this.selectedCategories.update(cats => cats.filter(c => c.id !== categoryId));
    this.form.markAsDirty();
  }

  // ── Utils ─────────────────────────────────────────────────────
  isInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl?.invalid && ctrl?.touched);
  }

  get createdAt(): string | null {
    // TODO: ProductAdmin doesn't have createdAt yet - add when backend provides it
    return null;
  }

  get updatedAt(): string | null {
    // TODO: ProductAdmin doesn't have updatedAt yet - add when backend provides it
    return null;
  }

  get createdBy(): string | null {
    // TODO: obtener nombre completo desde user ID
    return 'Admin'; // placeholder
  }
}

