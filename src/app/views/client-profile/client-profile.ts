import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  signal,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { selectUser } from '../../store/auth/auth.selectors';
import { updateProfileImageUrl } from '../../store/auth/auth.actions';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Order, Address, AddressType } from '../../type/types';
import { formatDate } from '../../shared/dates';
import { Chart } from 'chart.js';
import { LanguageService } from '../../services/language-service';
import { AddressService } from '../../services/address-service';
import { UserService } from '../../services/user-service';
import { MNotificationService } from '../../components/marcha/m-toast/m-notification.service';
import { MAvatar } from '../../components/marcha/m-avatar/m-avatar';
import { MToast } from '../../components/marcha/m-toast/m-toast';
import { MDivider } from '../../components/marcha/m-divider/m-divider';
import { MInput } from '../../components/marcha/m-input/m-input';
import { MButton } from '../../components/marcha/m-button/m-button';
import { MCard } from '../../components/marcha/m-card/m-card';
import { MTabs, MTabItem, MTabPanel } from '../../components/marcha/m-tabs/m-tabs';
import { MTable, MTableColumn, MTableAction } from '../../components/marcha/m-table/m-table';
import { MIcon } from '../../components/marcha/m-icon/m-icon';
import { MChip } from '../../components/marcha/m-chip/m-chip';
import { MCopy } from '../../components/marcha/m-copy/m-copy';
import { MDialog } from '../../components/marcha/m-dialog/m-dialog';
import { MPassword } from '../../components/marcha/m-password/m-password';

@Component({
  selector: 'app-client-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule, DatePipe, TranslateModule,
    MAvatar, MToast, MDivider, MInput, MButton,
    MCard, MTabs, MTabPanel, MTable, MIcon, MChip,
    MCopy, MDialog, MPassword,
  ],
  templateUrl: './client-profile.html',
})
export class ClientProfile implements OnInit {
  user$;
  orders!: Order[];
  activeTab = 0;
  private chartInitialized = false;
  private _chartInstance: Chart | null = null;
  chartLabels: string[] = ['', ''];

  // Addresses state
  addresses = signal<Address[]>([]);
  showAddressModal = signal(false);
  editingAddress = signal<Address | null>(null);
  readonly MAX_ADDRESSES = 5;
  readonly AddressType = AddressType;  // Para usar en el template
  countries: { label: string; value: string }[] = [];

  tabs: MTabItem[] = [
    { label: 'Datos personales', icon: 'lucide:user' },
    { label: 'Mis pedidos',      icon: 'lucide:receipt' },
    { label: 'Direcciones',      icon: 'lucide:map-pin' },
    { label: 'Estadísticas',     icon: 'lucide:bar-chart-2' },
  ];

  tableColumns: MTableColumn[] = [
    { field: 'id',     header: 'ID',           width: '80px', align: 'center' },
    { field: 'date',   header: 'Fecha pedido' },
    {
      field: 'status', header: 'Estado', type: 'badge',
      badgeSeverity: (v) => v === 'Completado' ? 'success' : v === 'Cancelado' ? 'danger' : 'warn',
    },
  ];

  tableActions: MTableAction[] = [];

  isDisabled = true;
  labelEdit  = '';
  colorEdit: 'primary' | 'danger' | 'warn' = 'warn';
  uploadingPhoto = signal(false);

  // Modales
  showVerifyEmailModal = signal(false);
  showChangePasswordModal = signal(false);
  sendingVerification = signal(false);
  changingPassword = signal(false);

  profileForm = new FormGroup({
    name:  new FormControl({ value: '', disabled: true }),
    email: new FormControl({ value: '', disabled: true }),
    phone: new FormControl({ value: '', disabled: true }),
  });

  addressForm = new FormGroup({
    type: new FormControl<AddressType>(AddressType.SHIPPING, { nonNullable: true }),
    addressLine1: new FormControl('', [Validators.required]),
    addressLine2: new FormControl(''),
    country: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    postalCode: new FormControl('', [Validators.required]),
    isDefault: new FormControl(false, { nonNullable: true }),
  });

  changePasswordForm = new FormGroup({
    currentPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
    newPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  constructor(
    public store: Store,
    private lang: LanguageService,
    private addressService: AddressService,
    private userService: UserService,
    private notificationService: MNotificationService
  ) {
    this.user$ = toSignal(this.store.select(selectUser));
  }

  // Setter: se dispara cuando el canvas aparece en el DOM (al activar tab 2)
  @ViewChild('chartCanvas') set chartCanvas(el: ElementRef<HTMLCanvasElement> | undefined) {
    if (el && !this.chartInitialized) {
      this.chartInitialized = true;
      this.initChart(el.nativeElement);
    }
  }

  private initChart(canvas: HTMLCanvasElement) {
    this._chartInstance = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        datasets: [
          {
            label: this.chartLabels[0],
            data: [12, 3, 3, 5, 2, 3, 2, 6, 7, 8, 1, 1],
            borderWidth: 1,
            backgroundColor: 'rgba(99,102,241,0.7)',
            borderColor: 'rgba(99,102,241,1)',
            borderRadius: 4,
          },
          {
            label: this.chartLabels[1],
            data: [12, 19, 3, 5, 2, 3, 45, 6, 7, 0, 0, 0],
            borderWidth: 1,
            backgroundColor: 'rgba(34,197,94,0.7)',
            borderColor: 'rgba(34,197,94,1)',
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#94a3b8' } } },
        scales: {
          x: { grid: { color: 'rgba(148,163,184,0.15)' }, ticks: { color: '#94a3b8' } },
          y: { grid: { color: 'rgba(148,163,184,0.15)' }, ticks: { color: '#94a3b8' } },
        },
      },
    });
  }

  async ngOnInit() {
    await this.loadTranslations();
    this.lang.onLanguageChange(() => this.loadTranslations());

    const user = this.user$();
    this.profileForm.setValue({
      name:  user?.name  ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? '',
    });

    // Cargar direcciones del usuario
    if (user?.id) {
      this.loadAddresses(user.id);
    }

    // Inicializar lista de países (lista simplificada)
    this.countries = [
      { label: 'España', value: 'España' },
      // { label: 'Francia', value: 'Francia' },
      // { label: 'Alemania', value: 'Alemania' },
      // { label: 'Italia', value: 'Italia' },
      // { label: 'Portugal', value: 'Portugal' },
      // { label: 'Reino Unido', value: 'Reino Unido' },
      // { label: 'Estados Unidos', value: 'Estados Unidos' },
      // { label: 'México', value: 'México' },
      // { label: 'Argentina', value: 'Argentina' },
      // { label: 'Colombia', value: 'Colombia' },
    ];

    this.orders = [
      {
        id: 1,
        date: formatDate(new Date('01-01-2023').toString()),
        status: 'Completado',
      },
      {
        id: 2,
        date: formatDate(new Date('12-04-2024').toString()),
        status: 'Completado',
      },
      {
        id: 3,
        date: formatDate(new Date('12-04-2025').toString()),
        status: 'Completado',
      },
      {
        id: 4,
        date: formatDate(new Date('05-05-2025').toString()),
        status: 'Completado',
      },
      {
        id: 5,
        date: formatDate(new Date('06-10-2025').toString()),
        status: 'Completado',
      },
      {
        id: 6,
        date: formatDate(new Date('07-15-2025').toString()),
        status: 'Cancelado',
      },
      {
        id: 7,
        date: formatDate(new Date('08-20-2025').toString()),
        status: 'Completado',
      },
      {
        id: 8,
        date: formatDate(new Date('09-25-2025').toString()),
        status: 'Completado',
      },
      {
        id: 9,
        date: formatDate(new Date('10-30-2025').toString()),
        status: 'Completado',
      },
      {
        id: 10,
        date: formatDate(new Date('11-05-2025').toString()),
        status: 'Completado',
      },
      {
        id: 11,
        date: formatDate(new Date('12-10-2025').toString()),
        status: 'Cancelado',
      },
      {
        id: 12,
        date: formatDate(new Date('01-15-2026').toString()),
        status: 'Completado',
      },
      {
        id: 13,
        date: formatDate(new Date('02-20-2026').toString()),
        status: 'Completado',
      },
      {
        id: 14,
        date: formatDate(new Date('03-01-2026').toString()),
        status: 'Completado',
      },
      {
        id: 15,
        date: formatDate(new Date('03-10-2026').toString()),
        status: 'Completado',
      },
    ];
  }

  private async loadTranslations() {
    const t = await this.lang.tMany([
      'profile.tab_personal', 'profile.tab_orders', 'profile.tab_addresses', 'profile.tab_stats',
      'profile.col_id', 'profile.col_date', 'profile.col_status',
      'profile.action_view', 'profile.action_invoice',
      'profile.btn_edit', 'profile.chart_2024', 'profile.chart_2025',
    ]);

    this.tabs = [
      { label: t['profile.tab_personal'],  icon: 'lucide:user' },
      { label: t['profile.tab_orders'],    icon: 'lucide:receipt' },
      { label: t['profile.tab_addresses'], icon: 'lucide:map-pin' },
      { label: t['profile.tab_stats'],     icon: 'lucide:bar-chart-2' },
    ];

    this.tableColumns = [
      { field: 'id',     header: t['profile.col_id'],     width: '80px', align: 'center' },
      { field: 'date',   header: t['profile.col_date'] },
      {
        field: 'status', header: t['profile.col_status'], type: 'badge',
        badgeSeverity: (v) => v === 'Completado' ? 'success' : v === 'Cancelado' ? 'danger' : 'warn',
      },
    ];

    this.tableActions = [
      { label: t['profile.action_view'],    icon: 'lucide:eye',     severity: 'secondary' },
      { label: t['profile.action_invoice'], icon: 'lucide:receipt', severity: 'warn' },
    ];

    this.labelEdit = t['profile.btn_edit'];
    this.chartLabels = [t['profile.chart_2024'], t['profile.chart_2025']];

    // Re-init chart si ya está visible
    if (this.chartInitialized && this._chartInstance) {
      this._chartInstance.data.datasets[0].label = this.chartLabels[0];
      this._chartInstance.data.datasets[1].label = this.chartLabels[1];
      this._chartInstance.update();
    }
  }

  onTabChange(index: number) {
    this.activeTab = index;
  }

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const user = this.user$();
    if (!user?.id) return;

    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      const errorMsg = await this.lang.tOne('profile.photo_invalid_format');
      this.notificationService.error(errorMsg);
      input.value = ''; // Limpiar el input
      return;
    }

    // Validar tamaño de archivo (máximo 5MB)
    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSizeInBytes) {
      const errorMsg = await this.lang.tOne('profile.photo_too_large');
      this.notificationService.error(errorMsg);
      input.value = ''; // Limpiar el input
      return;
    }

    // Iniciar subida
    this.uploadingPhoto.set(true);

    this.userService.uploadProfileImage(user.id, file).subscribe({
      next: async (imageUrl) => {
        this.store.dispatch(updateProfileImageUrl({ profileImageUrl: imageUrl }));
        const successMsg = await this.lang.tOne('profile.photo_upload_success');
        this.notificationService.success(successMsg);
        this.uploadingPhoto.set(false);
        input.value = ''; // Limpiar el input
      },
      error: async (err) => {
        console.error('Error subiendo foto:', err);
        const errorMsg = await this.lang.tOne('profile.photo_upload_error');
        this.notificationService.error(errorMsg);
        this.uploadingPhoto.set(false);
        input.value = ''; // Limpiar el input
      }
    });
  }

  async editForm() {
    this.isDisabled = !this.isDisabled;
    if (this.isDisabled) {
      this.profileForm.disable();
      this.labelEdit = await this.lang.tOne('profile.btn_edit');
      this.colorEdit = 'warn';
    } else {
      this.profileForm.enable();
      this.labelEdit = await this.lang.tOne('profile.btn_save');
      this.colorEdit = 'primary';
    }
  }

  async cancelForm() {
    const user = this.user$();
    this.profileForm.setValue({
      name:  user?.name  ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? '',
    });
    this.profileForm.disable();
    this.isDisabled = true;
    this.labelEdit = await this.lang.tOne('profile.btn_edit');
    this.colorEdit = 'warn';
  }

  // ==================== Role Display ====================

  /**
   * Obtener nombre traducido del rol.
   */
  getRoleDisplayName(roleName: string | undefined): string {
    if (!roleName) return '';
    
    const roleMap: Record<string, string> = {
      'ROLE_USER': 'Usuario',
      'ROLE_ADMIN': 'Admin',
      'SUPER_ADMIN': 'Super Admin',
    };
    
    return roleMap[roleName] || roleName;
  }

  // ==================== Email Verification ====================

  /**
   * Abrir modal de verificación de email.
   */
  openVerifyEmailModal() {
    this.showVerifyEmailModal.set(true);
  }

  /**
   * Cerrar modal de verificación de email.
   */
  closeVerifyEmailModal() {
    this.showVerifyEmailModal.set(false);
  }

  /**
   * Enviar email de verificación al usuario actual.
   */
  async sendVerificationEmail() {
    const user = this.user$();
    if (!user?.email) return;

    this.sendingVerification.set(true);

    // TODO: Implementar llamada al backend POST /auth/resend-verification
    // Por ahora, simular el envío
    setTimeout(async () => {
      const successMsg = await this.lang.tOne('profile.verification_email_sent');
      this.notificationService.success(successMsg);
      this.sendingVerification.set(false);
      this.closeVerifyEmailModal();
    }, 1500);
  }

  // ==================== Change Password ====================

  /**
   * Abrir modal de cambio de contraseña.
   */
  openChangePasswordModal() {
    this.changePasswordForm.reset();
    this.showChangePasswordModal.set(true);
  }

  /**
   * Cerrar modal de cambio de contraseña.
   */
  closeChangePasswordModal() {
    this.showChangePasswordModal.set(false);
    this.changePasswordForm.reset();
  }

  /**
   * Cambiar contraseña del usuario.
   */
  async changePassword() {
    if (this.changePasswordForm.invalid) {
      const errorMsg = await this.lang.tOne('validation.required');
      this.notificationService.error(errorMsg);
      return;
    }

    const formValue = this.changePasswordForm.getRawValue();

    // Validar que las contraseñas nuevas coincidan
    if (formValue.newPassword !== formValue.confirmPassword) {
      const errorMsg = await this.lang.tOne('validation.passwords_mismatch');
      this.notificationService.error(errorMsg);
      return;
    }

    this.changingPassword.set(true);

    // TODO: Implementar llamada al backend
    // Por ahora, simular el cambio
    setTimeout(async () => {
      const successMsg = await this.lang.tOne('profile.password_changed_success');
      this.notificationService.success(successMsg);
      this.changingPassword.set(false);
      this.closeChangePasswordModal();
    }, 1500);
  }

  // ==================== Addresses Management ====================

  /**
   * Cargar direcciones del usuario desde el backend.
   */
  private loadAddresses(userId: number) {
    this.addressService.getAddressesByUser(userId).subscribe({
      next: (addresses) => this.addresses.set(addresses),
      error: (err) => console.error('Error cargando direcciones:', err),
    });
  }

  /**
   * Abrir modal para añadir nueva dirección.
   */
  openAddAddressModal() {
    if (this.addresses().length >= this.MAX_ADDRESSES) {
      alert(`Solo puedes tener un máximo de ${this.MAX_ADDRESSES} direcciones.`);
      return;
    }
    this.editingAddress.set(null);
    this.addressForm.reset({
      type: AddressType.SHIPPING,
      addressLine1: '',
      addressLine2: '',
      country: '',
      city: '',
      postalCode: '',
      isDefault: false,
    });
    this.showAddressModal.set(true);
  }

  /**
   * Abrir modal para editar dirección existente.
   */
  openEditAddressModal(address: Address) {
    this.editingAddress.set(address);
    this.addressForm.patchValue({
      type: address.type,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || '',
      country: address.country,
      city: address.city,
      postalCode: address.postalCode,
      isDefault: address.isDefault,
    });
    this.showAddressModal.set(true);
  }

  /**
   * Cerrar modal de dirección.
   */
  closeAddressModal() {
    this.showAddressModal.set(false);
    this.editingAddress.set(null);
    this.addressForm.reset();
  }

  /**
   * Guardar dirección (crear o actualizar).
   */
  saveAddress() {
    if (this.addressForm.invalid) {
      return;
    }

    const formValue = this.addressForm.getRawValue();
    const addressData: Address = {
      type: formValue.type,
      addressLine1: formValue.addressLine1 || '',
      addressLine2: formValue.addressLine2 || undefined,
      country: formValue.country || '',
      city: formValue.city || '',
      postalCode: formValue.postalCode || '',
      isDefault: formValue.isDefault,
    };

    const editing = this.editingAddress();
    const userId = this.user$()?.id;

    if (!userId) {
      console.error('User ID not found');
      return;
    }

    if (editing?.id) {
      // Actualizar dirección existente
      addressData.id = editing.id;
      this.addressService.updateAddress(addressData).subscribe({
        next: () => {
          this.loadAddresses(userId);
          this.closeAddressModal();
        },
        error: (err) => console.error('Error actualizando dirección:', err),
      });
    } else {
      // Crear nueva dirección
      this.addressService.createAddress(addressData).subscribe({
        next: () => {
          this.loadAddresses(userId);
          this.closeAddressModal();
        },
        error: (err) => console.error('Error creando dirección:', err),
      });
    }
  }

  /**
   * Confirmar y eliminar dirección.
   */
  async confirmDeleteAddress(address: Address) {
    const addressName = `${address.addressLine1}, ${address.city}`;
    const confirmed = window.confirm(
      `¿Estás seguro de que deseas eliminar la dirección "${addressName}"?\n\nEsta acción no se puede deshacer.`
    );

    if (confirmed && address.id) {
      this.deleteAddress(address.id);
    }
  }

  /**
   * Eliminar dirección por ID.
   */
  private deleteAddress(id: number) {
    const userId = this.user$()?.id;
    if (!userId) return;

    this.addressService.deleteAddress(id).subscribe({
      next: () => {
        this.loadAddresses(userId);
      },
      error: (err) => console.error('Error eliminando dirección:', err),
    });
  }

  /**
   * Marcar dirección como predeterminada.
   */
  setDefaultAddress(address: Address) {
    if (address.isDefault) return; // Ya es la predeterminada

    const userId = this.user$()?.id;
    if (!userId || !address.id) return;

    const updatedAddress: Address = {
      ...address,
      isDefault: true,
    };

    this.addressService.updateAddress(updatedAddress).subscribe({
      next: () => {
        this.loadAddresses(userId);
      },
      error: (err) => console.error('Error estableciendo dirección predeterminada:', err),
    });
  }

  /**
   * Obtener badge severity según tipo de dirección.
   */
  getAddressTypeBadge(type: AddressType): 'primary' | 'secondary' {
    return type === AddressType.SHIPPING ? 'primary' : 'secondary';
  }
}
