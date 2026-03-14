import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { selectUser } from '../../store/auth/auth.selectors';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Order } from '../../type/types';
import { formatDate } from '../../shared/dates';
import { Chart, ChartConfiguration } from 'chart.js';
import { MAvatar } from '../../components/marcha/m-avatar/m-avatar';
import { MToast } from '../../components/marcha/m-toast/m-toast';
import { MDivider } from '../../components/marcha/m-divider/m-divider';
import { MFloatLabel } from '../../components/marcha/m-float-label/m-float-label';
import { MInput } from '../../components/marcha/m-input/m-input';
import { MButton } from '../../components/marcha/m-button/m-button';
import { MCard } from '../../components/marcha/m-card/m-card';
import { MTabs, MTabItem, MTabPanel } from '../../components/marcha/m-tabs/m-tabs';
import { MTable } from '../../components/marcha/m-table/m-table';
import { MIcon } from '../../components/marcha/m-icon/m-icon';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-client-profile',
  standalone: true,
  imports: [FormsModule, DatePipe, MAvatar, MToast, MDivider, MFloatLabel, MInput, MButton, MCard, MTabs, MTabPanel, MTable],
  templateUrl: './client-profile.html',
})
export class ClientProfile implements OnInit, AfterViewInit {
  user$;
  orders!: Order[];
  tabs: MTabItem[] = [
    { label: 'Pedidos', icon: 'lucide:receipt' },
    { label: 'Info', icon: 'lucide:info' }
  ];

  // Queries
  isMobile = window.matchMedia('(max-width: 600px)').matches;

  isCollapsed: boolean = true;
  isDisabled: boolean = true;
  labelEdit: string = 'Editar';
  colorEdit: 'primary' | 'danger' | 'warn' = 'warn';
  selectedFile: File | null = null;

  constructor(public store: Store) {
    this.user$ = toSignal(this.store.select(selectUser));
  }

  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit() {
    new Chart(this.chartCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: [
          'Enero',
          'Febrero',
          'Marzo',
          'Abril',
          'Mayo',
          'Junio',
          'Julio',
          'Agosto',
          'Septiembre',
          'Octubre',
          'Noviembre',
          'Diciembre',
        ],
        datasets: [
          {
            label: 'Ventas 2024',
            data: [12, 3, 3, 5, 2, 3, 2, 6, 7, 8, 1, 1],
            borderWidth: 1,
            backgroundColor: ['cyan'],
          },
          {
            label: 'Ventas 2025',
            data: [12, 19, 3, 5, 2, 3, 45, 6, 7],
            borderWidth: 1,
            backgroundColor: ['green'],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: {
              color: 'darkgrey',
            },
          },
          y: {
            grid: {
              color: 'darkgrey',
            },
          },
        },
      },
    });
  }

  ngOnInit() {
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

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.isCollapsed = true;
    }
  }

  editForm() {
    this.isDisabled = !this.isDisabled;
    this.labelEdit = this.isDisabled ? 'Editar' : 'Guardar';
    this.colorEdit = this.isDisabled ? 'warn' : 'primary';
  }

  cancelForm() {
    this.isDisabled = true;
    this.labelEdit = 'Editar';
  }
}
