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
  MNotificationService,
  MDrawerPosition, MTabItem,
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
