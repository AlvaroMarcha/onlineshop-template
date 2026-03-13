import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import {
  MButton, MCard, MIcon, MDivider,
  MAvatar, MBadge, MOverlayBadge,
  MInput, MPassword, MTextarea,
  MCheckbox, MNumberInput, MFloatLabel,
  MSelect, MRadioGroup, MRangeSlider,
  MMessage, MDialog, MDrawer,
  MTabs, MTabPanel,
  MAccordion,
  MChip, MTooltip,
  MCalendar,
  MTable,
  MColorPicker,
  MToggleSwitch, MCopy, MSortable,
  MNotificationService,
  MDrawerPosition, MTabItem, MAccordionItem, MDateRange, MTableColumn, MTableRow, MTableAction,
  MSortableItem,
} from '../../components/marcha';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MButton, MCard, MIcon, MDivider,
    MAvatar, MBadge, MOverlayBadge,
    MInput, MPassword, MTextarea,
    MCheckbox, MNumberInput, MFloatLabel,
    MSelect, MRadioGroup, MRangeSlider,
    MMessage, MDialog, MDrawer,
    MTabs, MTabPanel,
    MAccordion,
    MChip, MTooltip,
    MCalendar,
    MTable,
    MColorPicker,
    MToggleSwitch, MCopy, MSortable,
  ],
  templateUrl: './demo.html',
  styleUrl: './demo.css',
})
export class Demo {
  private readonly notify = inject(MNotificationService);

  loading = false;

  // Toggle Switch
  readonly toggleNotify   = new FormControl(true);
  readonly toggleDark     = new FormControl(false);
  readonly toggleDisabled = new FormControl({ value: true, disabled: true });

  // Copy
  readonly copyCode = 'npm install @marcha/ui';

  // Sortable
  sortableItems: MSortableItem[] = [
    { id: 1, label: 'Dashboard' },
    { id: 2, label: 'Analytics' },
    { id: 3, label: 'Settings' },
    { id: 4, label: 'Reports' },
    { id: 5, label: 'Users' },
  ];

  onSortChange(items: MSortableItem[]): void { this.sortableItems = items; }

  // Color Picker
  readonly colorAccent    = new FormControl('#6366f1');
  readonly colorInline    = new FormControl('#22c55e');
  readonly colorNoSwatches = new FormControl('#f97316');
  readonly colorDisabled  = new FormControl({ value: '#94a3b8', disabled: true });

  // Table
  tableSelection: MTableRow[] = [];
  readonly tableActions: MTableAction[] = [
    { label: 'Ver',      icon: 'lucide:eye',    severity: 'secondary' },
    { label: 'Editar',   icon: 'lucide:pencil', severity: 'primary' },
    { label: 'Eliminar', icon: 'lucide:trash-2', severity: 'danger',
      disabled: (row) => row['role'] === 'Admin' },
  ];
  readonly tableColumns: MTableColumn[] = [
    { field: 'avatar',  header: '',        type: 'avatar', width: '52px' },
    { field: 'name',    header: 'Nombre',  sortable: true },
    { field: 'email',   header: 'Email',   sortable: true },
    { field: 'role',    header: 'Rol',     sortable: true, type: 'badge',
      badgeSeverity: (v) => (({ Admin: 'danger', Dev: 'primary', Design: 'help', PM: 'warn', QA: 'info' } as Record<string, any>)[v as string] ?? 'secondary') },
    { field: 'status',  header: 'Estado',  type: 'badge',
      badgeSeverity: (v) => v === 'Activo' ? 'success' : v === 'Vacaciones' ? 'warn' : 'secondary' },
    { field: 'tasks',   header: 'Tareas',  sortable: true, type: 'number', align: 'right', width: '90px' },
    { field: 'joined',  header: 'Alta',    sortable: true, type: 'date',   width: '130px' },
  ];
  readonly tableData: MTableRow[] = [
    { id:  1, avatar: 'Ana García',       name: 'Ana García',       email: 'ana@marcha.dev',     role: 'Admin',  status: 'Activo',     tasks: 48, joined: new Date('2023-01-15') },
    { id:  2, avatar: 'Carlos Martínez',  name: 'Carlos Martínez',  email: 'carlos@marcha.dev',  role: 'Dev',    status: 'Activo',     tasks: 32, joined: new Date('2023-03-08') },
    { id:  3, avatar: 'Laura Pérez',      name: 'Laura Pérez',      email: 'laura@marcha.dev',   role: 'Design', status: 'Vacaciones', tasks: 19, joined: new Date('2023-06-01') },
    { id:  4, avatar: 'Miguel Ruiz',      name: 'Miguel Ruiz',      email: 'miguel@marcha.dev',  role: 'PM',     status: 'Activo',     tasks: 61, joined: new Date('2022-11-20') },
    { id:  5, avatar: 'Sofía Rodríguez',  name: 'Sofía Rodríguez',  email: 'sofia@marcha.dev',   role: 'Dev',    status: 'Activo',     tasks: 27, joined: new Date('2024-01-10') },
    { id:  6, avatar: 'Javier López',     name: 'Javier López',     email: 'javier@marcha.dev',  role: 'QA',     status: 'Baja',       tasks: 14, joined: new Date('2023-09-15') },
    { id:  7, avatar: 'Paula Sánchez',    name: 'Paula Sánchez',    email: 'paula@marcha.dev',   role: 'Dev',    status: 'Activo',     tasks: 38, joined: new Date('2024-02-20') },
    { id:  8, avatar: 'Diego González',   name: 'Diego González',   email: 'diego@marcha.dev',   role: 'Design', status: 'Activo',     tasks: 22, joined: new Date('2023-07-12') },
    { id:  9, avatar: 'Isabel Moreno',    name: 'Isabel Moreno',    email: 'isabel@marcha.dev',  role: 'Admin',  status: 'Vacaciones', tasks: 55, joined: new Date('2022-08-05') },
    { id: 10, avatar: 'Álvaro Jiménez',   name: 'Álvaro Jiménez',   email: 'alvaro@marcha.dev',  role: 'Dev',    status: 'Activo',     tasks: 41, joined: new Date('2023-04-18') },
    { id: 11, avatar: 'Nuria Fernández',  name: 'Nuria Fernández',  email: 'nuria@marcha.dev',   role: 'PM',     status: 'Activo',     tasks: 29, joined: new Date('2023-12-03') },
    { id: 12, avatar: 'Roberto Castro',   name: 'Roberto Castro',   email: 'roberto@marcha.dev', role: 'QA',     status: 'Activo',     tasks: 17, joined: new Date('2024-03-01') },
  ];
  showDialog = signal(false);
  showDrawer = signal(false);
  drawerPos  = signal<MDrawerPosition>('right');
  activeTab  = signal(0);
  activeTabPill = signal(0);

  // Calendar
  readonly calSingle      = new FormControl<Date | null>(null);
  readonly calRange       = new FormControl<MDateRange | null>(null);
  readonly calInline      = new FormControl<Date | null>(new Date());
  readonly calInlineRange = new FormControl<MDateRange | null>(null);

  readonly tabsDemo: MTabItem[] = [
    { label: 'General',         icon: 'lucide:user' },
    { label: 'Seguridad',       icon: 'lucide:lock' },
    { label: 'Notificaciones',  icon: 'lucide:bell' },
    { label: 'Deshabilitado',   icon: 'lucide:ban',  disabled: true },
  ];

  readonly tabsPill: MTabItem[] = [
    { label: 'Semana' },
    { label: 'Mes' },
    { label: 'Año' },
  ];

  readonly accordionItems: MAccordionItem[] = [
    { header: '¿Cuál es el plazo de entrega?',  icon: 'lucide:truck',    content: 'Los pedidos nacionales se entregan en 2-4 días hábiles. Los pedidos internacionales pueden tardar entre 7 y 14 días dependiendo del destino.' },
    { header: '¿Cómo puedo devolver un producto?', icon: 'lucide:refresh-cw', content: 'Tienes 30 días desde la recepción para solicitar una devolución. El producto debe estar sin usar y en su embalaje original. Inicia el proceso desde tu perfil.' },
    { header: '¿Qué métodos de pago aceptáis?',  icon: 'lucide:credit-card', content: 'Aceptamos tarjetas Visa, Mastercard, American Express, PayPal y transferencia bancaria. Todos los pagos están protegidos con cifrado SSL.' },
    { header: 'Opción deshabilitada',            icon: 'lucide:lock',       content: 'Este panel está deshabilitado.', disabled: true },
  ];

  readonly accordionMultiple: MAccordionItem[] = [
    { header: 'Panel A — apertura múltiple',  content: 'Este acordeón permite tener varios paneles abiertos simultáneamente. Útil para listas de configuración o FAQs densas.' },
    { header: 'Panel B — expandible',        content: 'Puedes abrir este panel sin cerrar el anterior.' },
    { header: 'Panel C — independiente',     content: 'Cada panel se gestiona de forma independiente cuando multiple está activado.' },
  ];

  form = new FormGroup({
    nombre: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.minLength(8)),
    bio: new FormControl(''),
    cantidad: new FormControl(1),
    terminos: new FormControl(false),
    pais: new FormControl(null),
    talla: new FormControl(null),
    rango: new FormControl<[number, number]>([20, 75]),
  });

  readonly paises = [
    { label: 'España', value: 'es' },
    { label: 'México', value: 'mx' },
    { label: 'Argentina', value: 'ar' },
    { label: 'Colombia', value: 'co' },
  ];

  readonly tallas = [
    { label: 'XS', value: 'xs' },
    { label: 'S',  value: 's'  },
    { label: 'M',  value: 'm'  },
    { label: 'L',  value: 'l'  },
    { label: 'XL', value: 'xl' },
  ];

  readonly planesOpts = [
    { label: 'Básico — Gratis',         value: 'free'    },
    { label: 'Pro — 9 € / mes',         value: 'pro'     },
    { label: 'Business — 29 € / mes',   value: 'business'},
  ];

  toggleLoading() {
    this.loading = true;
    setTimeout(() => (this.loading = false), 2000);
  }

  toast(severity: 'success' | 'error' | 'info' | 'warn', summary: string, detail?: string) {
    this.notify[severity](summary, detail);
  }

  openDrawer(pos: MDrawerPosition) {
    this.drawerPos.set(pos);
    this.showDrawer.set(true);
  }
}
