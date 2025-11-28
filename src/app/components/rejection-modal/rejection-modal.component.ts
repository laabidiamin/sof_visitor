import { Component, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-rejection-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
        <!-- Header -->
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-2xl font-bold text-gray-900">Refuser la demande</h2>
          <p class="text-gray-600 mt-2">Expliquez pourquoi vous refusez cette demande</p>
        </div>

        <!-- Content -->
        <div class="p-6">
          <label class="block text-sm font-semibold text-gray-900 mb-3">Commentaire <span class="text-red-500">*</span></label>
          <textarea
            [value]="comment()"
            (input)="comment.set($any($event.target).value)"
            placeholder="Expliquez votre décision de refus..."
            rows="5"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-none"
          ></textarea>
          <p class="text-xs text-gray-500 mt-2">Le commentaire sera envoyé au demandeur</p>
        </div>

        <!-- Footer -->
        <div class="flex justify-between gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            (click)="closeModal()"
            class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition"
          >
            Annuler
          </button>
          <button
            (click)="submit()"
            [disabled]="!comment().trim()"
            [class.opacity-50]="!comment().trim()"
            [class.cursor-not-allowed]="!comment().trim()"
            class="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition disabled:hover:bg-red-600"
          >
            Confirmer le refus
          </button>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class RejectionModalComponent {
  comment = signal('');
  
  closed = output<void>();
  submitted = output<{comment: string}>();

  closeModal() {
    this.closed.emit();
  }

  submit() {
    const commentValue = this.comment();
    if (commentValue && commentValue.trim()) {
      this.submitted.emit({ comment: commentValue });
    }
  }
}
