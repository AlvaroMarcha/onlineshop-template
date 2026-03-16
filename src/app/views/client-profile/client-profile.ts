import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { selectUser } from '../../store/auth/auth.selectors';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Order } from '../../type/types';
import { formatDate } from '../../shared/dates';
import { Chart } from 'chart.js';
import { LanguageService } from '../../services/language-service';
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

@Component({
  selector: 'app-client-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule, DatePipe, TranslateModule,
    MAvatar, MToast, MDivider, MInput, MButton,
    MCard, MTabs, MTabPanel, MTable, MIcon, MChip,
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

  tabs: MTabItem[] = [
    { label: 'Datos personales', icon: 'lucide:user' },
    { label: 'Mis pedidos',      icon: 'lucide:receipt' },
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
  selectedFile: File | null = null;

  profileForm = new FormGroup({
    name:  new FormControl({ value: '', disabled: true }),
    email: new FormControl({ value: '', disabled: true }),
    phone: new FormControl({ value: '', disabled: true }),
  });

  constructor(public store: Store, private lang: LanguageService) {
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
    ];
  }

  private async loadTranslations() {
    const t = await this.lang.tMany([
      'profile.tab_personal', 'profile.tab_orders', 'profile.tab_stats',
      'profile.col_id', 'profile.col_date', 'profile.col_status',
      'profile.action_view', 'profile.action_invoice',
      'profile.btn_edit', 'profile.chart_2024', 'profile.chart_2025',
    ]);

    this.tabs = [
      { label: t['profile.tab_personal'], icon: 'lucide:user' },
      { label: t['profile.tab_orders'],   icon: 'lucide:receipt' },
      { label: t['profile.tab_stats'],    icon: 'lucide:bar-chart-2' },
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

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
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
}
