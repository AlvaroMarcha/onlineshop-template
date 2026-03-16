import { Injectable, signal } from '@angular/core';

export type MToastSeverity = 'info' | 'success' | 'warn' | 'error';

export interface MToastItem {
  id:       number;
  severity: MToastSeverity;
  summary:  string;
  detail?:  string;
  /** Milisegundos hasta el auto-cierre. 0 = sticky. */
  life:     number;
}

let _nextId = 0;

@Injectable({ providedIn: 'root' })
export class MNotificationService {
  readonly toasts = signal<MToastItem[]>([]);

  add(item: Omit<MToastItem, 'id'>): void {
    const toast: MToastItem = { ...item, id: ++_nextId };
    this.toasts.update(list => [...list, toast]);
    if (toast.life > 0) {
      setTimeout(() => this.remove(toast.id), toast.life);
    }
  }

  remove(id: number): void {
    this.toasts.update(list => list.filter(t => t.id !== id));
  }

  success(summary: string, detail?: string, life = 4000) {
    this.add({ severity: 'success', summary, detail, life });
  }

  error(summary: string, detail?: string, life = 6000) {
    this.add({ severity: 'error', summary, detail, life });
  }

  info(summary: string, detail?: string, life = 4000) {
    this.add({ severity: 'info', summary, detail, life });
  }

  warn(summary: string, detail?: string, life = 5000) {
    this.add({ severity: 'warn', summary, detail, life });
  }
}
