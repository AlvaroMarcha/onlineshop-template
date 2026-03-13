import {
  Component, input, forwardRef, signal, computed,
  ChangeDetectionStrategy, OnInit,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MIcon } from '../m-icon/m-icon';

export type MCalendarMode = 'single' | 'range';

export interface MDateRange {
  start: Date | null;
  end: Date | null;
}

interface CalendarDay {
  date: Date;
  day: number;
  currentMonth: boolean;
  today: boolean;
  disabled: boolean;
}

const MONTH_NAMES_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];
const DAY_NAMES = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'];

@Component({
  selector: 'm-calendar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MIcon, NgTemplateOutlet],
  templateUrl: './m-calendar.html',
  styleUrl: './m-calendar.css',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MCalendar),
    multi: true,
  }],
})
export class MCalendar implements ControlValueAccessor, OnInit {
  readonly mode      = input<MCalendarMode>('single');
  readonly minDate   = input<Date | null>(null);
  readonly maxDate   = input<Date | null>(null);
  readonly inline    = input(false);

  // Estado interno
  readonly viewYear  = signal(new Date().getFullYear());
  readonly viewMonth = signal(new Date().getMonth()); // 0-based

  readonly selectedDate  = signal<Date | null>(null);
  readonly rangeStart    = signal<Date | null>(null);
  readonly rangeEnd      = signal<Date | null>(null);
  readonly hoverDate     = signal<Date | null>(null);

  readonly isDisabled = signal(false);
  readonly isOpen     = signal(false);

  readonly dayNames = DAY_NAMES;

  readonly monthLabel = computed(() =>
    `${MONTH_NAMES_ES[this.viewMonth()]} ${this.viewYear()}`
  );

  // Cuadrícula de 42 celdas (6 semanas × 7 días), semana empieza en lunes
  readonly days = computed<CalendarDay[]>(() => {
    const year  = this.viewYear();
    const month = this.viewMonth();
    const today = new Date();
    const firstDay = new Date(year, month, 1);
    // getDay(): 0=Dom,1=Lun,...,6=Sab → ajustamos para lunes=0
    let startOffset = (firstDay.getDay() + 6) % 7;
    const totalDays = new Date(year, month + 1, 0).getDate();
    const cells: CalendarDay[] = [];
    // Días del mes anterior
    for (let i = startOffset - 1; i >= 0; i--) {
      const d = new Date(year, month, -i);
      cells.push(this._makeDay(d, false, today));
    }
    // Días del mes actual
    for (let d = 1; d <= totalDays; d++) {
      cells.push(this._makeDay(new Date(year, month, d), true, today));
    }
    // Días del mes siguiente (hasta completar 42)
    let next = 1;
    while (cells.length < 42) {
      cells.push(this._makeDay(new Date(year, month + 1, next++), false, today));
    }
    return cells;
  });

  private _makeDay(date: Date, currentMonth: boolean, today: Date): CalendarDay {
    const min = this.minDate();
    const max = this.maxDate();
    const disabled =
      (min != null && this._stripTime(date) < this._stripTime(min)) ||
      (max != null && this._stripTime(date) > this._stripTime(max));
    return {
      date,
      day: date.getDate(),
      currentMonth,
      today: this._isSameDay(date, today),
      disabled,
    };
  }

  private _onChange: (v: Date | MDateRange | null) => void = () => {};
  private _onTouched: () => void = () => {};

  ngOnInit(): void {}

  // ControlValueAccessor
  writeValue(val: Date | MDateRange | null): void {
    if (!val) { this.selectedDate.set(null); this.rangeStart.set(null); this.rangeEnd.set(null); return; }
    if (this.mode() === 'range') {
      const r = val as MDateRange;
      this.rangeStart.set(r.start);
      this.rangeEnd.set(r.end);
      if (r.start) { this.viewMonth.set(r.start.getMonth()); this.viewYear.set(r.start.getFullYear()); }
    } else {
      const d = val as Date;
      this.selectedDate.set(d);
      this.viewMonth.set(d.getMonth());
      this.viewYear.set(d.getFullYear());
    }
  }
  registerOnChange(fn: (v: Date | MDateRange | null) => void): void { this._onChange = fn; }
  registerOnTouched(fn: () => void): void { this._onTouched = fn; }
  setDisabledState(d: boolean): void { this.isDisabled.set(d); }

  // Navegación
  prevMonth(): void {
    if (this.viewMonth() === 0) { this.viewMonth.set(11); this.viewYear.update(y => y - 1); }
    else { this.viewMonth.update(m => m - 1); }
  }
  nextMonth(): void {
    if (this.viewMonth() === 11) { this.viewMonth.set(0); this.viewYear.update(y => y + 1); }
    else { this.viewMonth.update(m => m + 1); }
  }
  goToToday(): void {
    const now = new Date();
    this.viewMonth.set(now.getMonth());
    this.viewYear.set(now.getFullYear());
  }

  // Selección
  selectDay(day: CalendarDay): void {
    if (day.disabled || this.isDisabled()) return;
    if (this.mode() === 'range') {
      this._handleRange(day.date);
    } else {
      this.selectedDate.set(day.date);
      this._onChange(day.date);
      this._onTouched();
      if (!this.inline()) this.isOpen.set(false);
    }
  }

  private _handleRange(date: Date): void {
    const start = this.rangeStart();
    const end   = this.rangeEnd();
    if (!start || (start && end)) {
      // Inicia nueva selección
      this.rangeStart.set(date);
      this.rangeEnd.set(null);
    } else {
      // Cierra el rango
      if (this._stripTime(date) < this._stripTime(start)) {
        this.rangeStart.set(date);
        this.rangeEnd.set(start);
      } else {
        this.rangeEnd.set(date);
      }
      const range: MDateRange = { start: this.rangeStart(), end: this.rangeEnd() };
      this._onChange(range);
      this._onTouched();
      if (!this.inline()) this.isOpen.set(false);
    }
  }

  onHover(day: CalendarDay): void { this.hoverDate.set(day.date); }
  onLeave(): void { this.hoverDate.set(null); }

  toggleOpen(): void {
    if (this.isDisabled()) return;
    this.isOpen.update(v => !v);
    this._onTouched();
  }

  // Computados para clases
  isDaySelected(day: CalendarDay): boolean {
    if (this.mode() === 'single') return this._isSameDay(day.date, this.selectedDate());
    return this._isSameDay(day.date, this.rangeStart()) || this._isSameDay(day.date, this.rangeEnd());
  }

  isDayInRange(day: CalendarDay): boolean {
    if (this.mode() !== 'range') return false;
    const start = this.rangeStart();
    const end   = this.rangeEnd() ?? this.hoverDate();
    if (!start || !end) return false;
    const t = this._stripTime(day.date);
    const s = this._stripTime(start);
    const e = this._stripTime(end);
    return t > Math.min(s, e) && t < Math.max(s, e);
  }

  isDayRangeStart(day: CalendarDay): boolean {
    return this.mode() === 'range' && this._isSameDay(day.date, this.rangeStart());
  }

  isDayRangeEnd(day: CalendarDay): boolean {
    return this.mode() === 'range' && this._isSameDay(day.date, this.rangeEnd());
  }

  get inputLabel(): string {
    if (this.mode() === 'range') {
      const s = this.rangeStart();
      const e = this.rangeEnd();
      if (!s) return '';
      if (!e) return this._fmt(s);
      return `${this._fmt(s)} – ${this._fmt(e)}`;
    }
    const d = this.selectedDate();
    return d ? this._fmt(d) : '';
  }

  private _fmt(d: Date): string {
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  }
  private _stripTime(d: Date | null): number {
    if (!d) return 0;
    return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  }
  private _isSameDay(a: Date | null | undefined, b: Date | null | undefined): boolean {
    if (!a || !b) return false;
    return a.getFullYear() === b.getFullYear() &&
           a.getMonth()    === b.getMonth()    &&
           a.getDate()     === b.getDate();
  }
}
