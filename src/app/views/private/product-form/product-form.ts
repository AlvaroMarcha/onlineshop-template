import {
  Component, ChangeDetectionStrategy, inject, signal, computed, OnInit, OnDestroy,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import {
  MCard, MButton, MIcon, MInput, MTextarea, MCheckbox,
  MNumberInput, MFloatLabel, MMessage,
} from '../../../components/marcha';
import {
  adminProductLoad,
  adminProductCreate,
  adminProductUpdate,
  adminProductClear,
  adminProductsLoadAttribs,
} from '../../../store/admin/products/admin-products.actions';
import {
  selectAdminProductSelected,
  selectAdminProductAttribs,
  selectAdminProductLoading,
  selectAdminProductSaving,
  selectAdminProductError,
} from '../../../store/admin/products/admin-products.selectors';
import { ProductCreateRequest } from '../../../type/admin-types';

@Component({
  selector: 'app-product-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslateModule, ReactiveFormsModule,
    MCard, MButton, MIcon, MInput, MTextarea, MCheckbox,
    MNumberInput, MFloatLabel, MMessage,
  ],
  templateUrl: './product-form.html',
  styleUrl:    './product-form.css',
})
export class ProductForm implements OnInit, OnDestroy {
  private store  = inject(Store);
  private route  = inject(ActivatedRoute);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  // ── Modo ──────────────────────────────────────────────────────
  readonly productId = signal<number | null>(null);
  readonly isEdit    = computed(() => this.productId() !== null);

  // ── Store ─────────────────────────────────────────────────────
  readonly selected = toSignal(this.store.select(selectAdminProductSelected));
  readonly attribs  = toSignal(this.store.select(selectAdminProductAttribs), { initialValue: [] });
  readonly loading  = toSignal(this.store.select(selectAdminProductLoading), { initialValue: false });
  readonly saving   = toSignal(this.store.select(selectAdminProductSaving),  { initialValue: false });
  readonly error    = toSignal(this.store.select(selectAdminProductError));

  // ── Formulario ────────────────────────────────────────────────
  readonly form = new FormGroup({
    name:               new FormControl('',          { nonNullable: true, validators: [Validators.required, Validators.minLength(2)] }),
    sku:                new FormControl('',          { nonNullable: true, validators: [Validators.required] }),
    slug:               new FormControl('',          { nonNullable: true }),
    description:        new FormControl('',          { nonNullable: true }),
    price:              new FormControl<number>(0,   { nonNullable: true, validators: [Validators.required, Validators.min(0)] }),
    discountPrice:      new FormControl<number | null>(null),
    taxRate:            new FormControl<number>(21,  { nonNullable: true, validators: [Validators.required, Validators.min(0)] }),
    stock:              new FormControl<number>(0,   { nonNullable: true, validators: [Validators.required, Validators.min(0)] }),
    lowStockThreshold:  new FormControl<number>(3,   { nonNullable: true, validators: [Validators.min(0)] }),
    weight:             new FormControl<number | null>(null),
    isDigital:          new FormControl(false,       { nonNullable: true }),
    isFeatured:         new FormControl(false,       { nonNullable: true }),
    metaTitle:          new FormControl<string | null>(null),
    metaDescription:    new FormControl<string | null>(null),
  });

  ngOnInit() {
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
            sku:               product.sku,
            slug:              product.slug ?? '',
            description:       product.description ?? '',
            price:             product.price,
            discountPrice:     product.discountPrice,
            taxRate:           product.taxRate,
            stock:             product.stock,
            lowStockThreshold: product.lowStockThreshold,
            weight:            product.weight,
            isDigital:         product.isDigital,
            isFeatured:        product.isFeatured,
            metaTitle:         product.metaTitle,
            metaDescription:   product.metaDescription,
          });
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.store.dispatch(adminProductClear());
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const payload: ProductCreateRequest = {
      name:              raw.name,
      sku:               raw.sku,
      slug:              raw.slug || raw.name.toLowerCase().replace(/\s+/g, '-'),
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
      categoryIds:       [],
    };

    const id = this.productId();
    if (id !== null) {
      this.store.dispatch(adminProductUpdate({ id, payload }));
    } else {
      this.store.dispatch(adminProductCreate({ payload }));
    }
  }

  cancel() {
    this.router.navigate(['/admin/products']);
  }

  isInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl?.invalid && ctrl?.touched);
  }
}

