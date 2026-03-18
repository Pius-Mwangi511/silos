import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast { id: number; message: string; type: 'success' | 'error' | 'info'; }

@Injectable({ providedIn: 'root' })
export class ToastService {
  private _toasts = new BehaviorSubject<Toast[]>([]);
  toasts$ = this._toasts.asObservable();
  private counter = 0;

  show(message: string, type: Toast['type'] = 'info') {
    const id = ++this.counter;
    this._toasts.next([...this._toasts.value, { id, message, type }]);
    setTimeout(() => this.dismiss(id), 3500);
  }

  success(msg: string) { this.show(msg, 'success'); }
  error(msg: string)   { this.show(msg, 'error'); }
  info(msg: string)    { this.show(msg, 'info'); }

  dismiss(id: number) {
    this._toasts.next(this._toasts.value.filter(t => t.id !== id));
  }
}
