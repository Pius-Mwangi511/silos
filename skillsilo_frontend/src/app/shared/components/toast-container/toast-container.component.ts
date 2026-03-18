import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (t of toastService.toasts$ | async; track t.id) {
        <div class="toast toast--{{ t.type }}" (click)="toastService.dismiss(t.id)">
          {{ t.message }}
        </div>
      }
    </div>
  `
})
export class ToastContainerComponent {
  constructor(public toastService: ToastService) {}
}
