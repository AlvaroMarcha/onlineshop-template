import { Component, input, output, signal, ChangeDetectionStrategy } from '@angular/core';
import { MIcon } from '../m-icon/m-icon';

export interface MSortableItem {
  id: string | number;
  label: string;
  [key: string]: unknown;
}

@Component({
  selector: 'm-sortable',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MIcon],
  templateUrl: './m-sortable.html',
  styleUrl: './m-sortable.css',
})
export class MSortable {
  readonly items       = input.required<MSortableItem[]>();
  readonly orderChange = output<MSortableItem[]>();
  readonly emptyMessage = input('Sin elementos');

  readonly _dragIndex = signal<number | null>(null);
  readonly _overIndex = signal<number | null>(null);

  isDragging(i: number): boolean {
    return this._dragIndex() === i;
  }

  isDragOver(i: number): boolean {
    return this._overIndex() === i && this._dragIndex() !== i;
  }

  onDragStart(e: DragEvent, i: number): void {
    this._dragIndex.set(i);
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', String(i));
    }
  }

  onDragOver(e: DragEvent, i: number): void {
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
    this._overIndex.set(i);
  }

  onDragLeave(): void {
    this._overIndex.set(null);
  }

  onDrop(e: DragEvent, targetIndex: number): void {
    e.preventDefault();
    const from = this._dragIndex();
    if (from === null || from === targetIndex) { this._reset(); return; }
    const arr = [...this.items()];
    const [moved] = arr.splice(from, 1);
    arr.splice(targetIndex, 0, moved);
    this.orderChange.emit(arr);
    this._reset();
  }

  onDragEnd(): void {
    this._reset();
  }

  private _reset(): void {
    this._dragIndex.set(null);
    this._overIndex.set(null);
  }
}
