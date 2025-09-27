import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { PrimengModule } from '../../shared/primeng/primeng-module';
import { MessageService } from 'primeng/api';
import { FileUploadEvent } from 'primeng/fileupload';
import { Store } from '@ngrx/store';
import { selectUser } from '../../store/auth/auth.selectors';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ButtonSeverity } from 'primeng/button';
import { Order } from '../../type/types';
import { formatDate } from '../../shared/dates';
import { Chart, ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-client-profile',
  standalone: true,
  imports: [PrimengModule, FormsModule],
  templateUrl: './client-profile.html',
  providers: [MessageService],
})
export class ClientProfile implements OnInit, AfterViewInit {
  user$: any;
  orders!: Order[];

  // Queries
  isMobile = window.matchMedia('(max-width: 600px)').matches;

  isCollapsed: boolean = true;
  isDisabled: boolean = true;
  labelEdit: string = 'Editar';
  colorEdit: ButtonSeverity = 'warn';

  constructor(private messageService: MessageService, public store: Store) {
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

  onBasicUploadAuto(event: FileUploadEvent) {
    this.messageService.add({
      severity: 'success',
      summary: 'Puede tardar unos minutos',
      detail: 'Archivo subido de forma automática',
    });
    this.isCollapsed = true;
  }

  editForm() {
    this.isDisabled = !this.isDisabled;
    this.labelEdit = this.isDisabled ? 'Editar' : 'Guardar';
    this.colorEdit = this.isDisabled ? 'warn' : 'info';
  }

  cancelForm() {
    this.isDisabled = true;
    this.labelEdit = 'Editar';
  }
}
