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
  MNotificationService,
  MDrawerPosition, MTabItem, MAccordionItem, MDateRange,
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
  ],
  templateUrl: './demo.html',
  styleUrl: './demo.css',
})
export class Demo {
  private readonly notify = inject(MNotificationService);

  loading = false;
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
