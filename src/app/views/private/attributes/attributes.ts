import {
  Component, ChangeDetectionStrategy, inject, signal, computed, OnInit,
} from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';
import {
  MCard, MButton, MTable, MIcon, MDialog, MInput,
} from '../../../components/marcha';
import type { MTableColumn, MTableAction, MChipSeverity } from '../../../components/marcha';
import {
  adminProductsLoadAttribs,
  adminAttribCreate,
  adminAttribUpdate,
  adminAttribDelete,
  adminAttribValueCreate,
  adminAttribValueUpdate,
  adminAttribValueDelete,
} from '../../../store/admin/products/admin-products.actions';
import {
  selectAdminProductAttribs,
  selectAdminProductLoading,
  selectAdminProductSaving,
  selectAdminProductError,
} from '../../../store/admin/products/admin-products.selectors';
import { ProductAttrib, ProductAttribValue } from '../../../type/admin-types';

@Component({
  selector: 'app-attributes-admin',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslateModule, ReactiveFormsModule, FormsModule,
    MCard, MButton, MTable, MIcon, MDialog, MInput,
  ],
  templateUrl: './attributes.html',
  styleUrl:    './attributes.css',
})
export class AttributesAdmin implements OnInit {
  private store = inject(Store);

  // ── Store ────────────────────────────────────────────────────
  readonly allAttribs = toSignal(this.store.select(selectAdminProductAttribs), { initialValue: [] });
  readonly loading    = toSignal(this.store.select(selectAdminProductLoading), { initialValue: false });
  readonly saving     = toSignal(this.store.select(selectAdminProductSaving),  { initialValue: false });
  readonly error      = toSignal(this.store.select(selectAdminProductError));

  // ── Filtro local ─────────────────────────────────────────────
  readonly searchTerm = signal('');

  readonly attribs = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.allAttribs();
    return this.allAttribs().filter(a => a.name.toLowerCase().includes(term));
  });

  // ── Panel de valores ──────────────────────────────────────────
  readonly selectedAttrib = signal<ProductAttrib | null>(null);

  readonly valueRows = computed(() => {
    const attrib = this.allAttribs().find(a => a.id === this.selectedAttrib()?.id);
    return attrib?.values ?? [];
  });

  // ── Diálogo crear/editar atributo ─────────────────────────────
  readonly attribDialogVisible = signal(false);
  readonly attribDialogMode    = signal<'create' | 'edit'>('create');
  readonly attribTarget        = signal<ProductAttrib | null>(null);

  readonly attribForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  // ── Diálogo borrar atributo ───────────────────────────────────
  readonly deleteAttribDialogVisible = signal(false);
  readonly deleteAttribTarget        = signal<ProductAttrib | null>(null);

  // ── Diálogo crear/editar valor ────────────────────────────────
  readonly valueDialogVisible = signal(false);
  readonly valueDialogMode    = signal<'create' | 'edit'>('create');
  readonly valueTarget        = signal<ProductAttribValue | null>(null);

  readonly valueForm = new FormGroup({
    value: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  // ── Diálogo borrar valor ──────────────────────────────────────
  readonly deleteValueDialogVisible = signal(false);
  readonly deleteValueTarget        = signal<ProductAttribValue | null>(null);

  // ── Columnas tabla atributos ──────────────────────────────────
  readonly attribColumns: MTableColumn[] = [
    { field: 'name', header: 'Nombre' },
    {
      field: 'active', header: 'Estado', type: 'badge', align: 'center',
      badgeSeverity: (v) => (v ? 'success' : 'secondary') as MChipSeverity,
      badgeLabel:    (v) => (v ? 'Activo' : 'Inactivo'),
    },
    {
      field: 'values', header: 'Valores', align: 'center',
      format: (v) => String((v as ProductAttribValue[])?.length ?? 0),
    },
  ];

  readonly attribActions: MTableAction[] = [
    { label: 'Valores',  icon: 'list',   severity: 'info'    },
    { label: 'Editar',   icon: 'edit',   severity: 'primary' },
    { label: 'Eliminar', icon: 'delete', severity: 'danger'  },
  ];

  // ── Columnas tabla valores ────────────────────────────────────
  readonly valueColumns: MTableColumn[] = [
    { field: 'value', header: 'Valor' },
    {
      field: 'active', header: 'Estado', type: 'badge', align: 'center',
      badgeSeverity: (v) => (v ? 'success' : 'secondary') as MChipSeverity,
      badgeLabel:    (v) => (v ? 'Activo' : 'Inactivo'),
    },
  ];

  readonly valueActions: MTableAction[] = [
    { label: 'Editar',   icon: 'edit',   severity: 'primary' },
    { label: 'Eliminar', icon: 'delete', severity: 'danger'  },
  ];

  // ── Lifecycle ─────────────────────────────────────────────────
  ngOnInit() {
    this.store.dispatch(adminProductsLoadAttribs());
  }

  // ── Acciones de atributo ──────────────────────────────────────
  onAttribAction(event: { action: MTableAction; row: Record<string, unknown> }) {
    const attrib = event.row as unknown as ProductAttrib;
    if (event.action.label === 'Valores') {
      this.selectedAttrib.set(attrib);
    } else if (event.action.label === 'Editar') {
      this.openAttribEditDialog(attrib);
    } else if (event.action.label === 'Eliminar') {
      this.deleteAttribTarget.set(attrib);
      this.deleteAttribDialogVisible.set(true);
    }
  }

  openAttribCreateDialog() {
    this.attribDialogMode.set('create');
    this.attribTarget.set(null);
    this.attribForm.reset();
    this.attribDialogVisible.set(true);
  }

  openAttribEditDialog(attrib: ProductAttrib) {
    this.attribDialogMode.set('edit');
    this.attribTarget.set(attrib);
    this.attribForm.setValue({ name: attrib.name });
    this.attribDialogVisible.set(true);
  }

  submitAttrib() {
    if (this.attribForm.invalid) return;
    const { name } = this.attribForm.getRawValue();
    const target = this.attribTarget();
    if (this.attribDialogMode() === 'create') {
      this.store.dispatch(adminAttribCreate({ name }));
    } else if (target) {
      this.store.dispatch(adminAttribUpdate({ id: target.id, name }));
    }
    this.attribDialogVisible.set(false);
  }

  confirmDeleteAttrib() {
    const attrib = this.deleteAttribTarget();
    if (attrib) {
      this.store.dispatch(adminAttribDelete({ id: attrib.id }));
      if (this.selectedAttrib()?.id === attrib.id) {
        this.selectedAttrib.set(null);
      }
    }
    this.deleteAttribDialogVisible.set(false);
    this.deleteAttribTarget.set(null);
  }

  // ── Acciones de valor ─────────────────────────────────────────
  onValueAction(event: { action: MTableAction; row: Record<string, unknown> }) {
    const val = event.row as unknown as ProductAttribValue;
    if (event.action.label === 'Editar') {
      this.openValueEditDialog(val);
    } else if (event.action.label === 'Eliminar') {
      this.deleteValueTarget.set(val);
      this.deleteValueDialogVisible.set(true);
    }
  }

  openValueCreateDialog() {
    this.valueDialogMode.set('create');
    this.valueTarget.set(null);
    this.valueForm.reset();
    this.valueDialogVisible.set(true);
  }

  openValueEditDialog(val: ProductAttribValue) {
    this.valueDialogMode.set('edit');
    this.valueTarget.set(val);
    this.valueForm.setValue({ value: val.value });
    this.valueDialogVisible.set(true);
  }

  submitValue() {
    if (this.valueForm.invalid) return;
    const { value } = this.valueForm.getRawValue();
    const attrib = this.selectedAttrib();
    if (!attrib) return;
    const target = this.valueTarget();
    if (this.valueDialogMode() === 'create') {
      this.store.dispatch(adminAttribValueCreate({ attribId: attrib.id, value }));
    } else if (target) {
      this.store.dispatch(adminAttribValueUpdate({ attribId: attrib.id, valueId: target.id, value }));
    }
    this.valueDialogVisible.set(false);
  }

  confirmDeleteValue() {
    const attrib = this.selectedAttrib();
    const val    = this.deleteValueTarget();
    if (attrib && val) {
      this.store.dispatch(adminAttribValueDelete({ attribId: attrib.id, valueId: val.id }));
    }
    this.deleteValueDialogVisible.set(false);
    this.deleteValueTarget.set(null);
  }
}

