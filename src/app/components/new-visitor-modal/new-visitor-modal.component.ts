import { Component, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RequestService, Service } from '../../services/request.service';

interface VisitorForm {
  name: string;
  company: string;
  email: string;
  phone: string;
  arrivalDate: string;
  arrivalTime: string;
  departureDate: string;
  departureTime: string;
  host: string;
  reason: string;
}

@Component({
  selector: 'app-new-visitor-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 class="text-2xl font-bold text-gray-900">Nouveau Visiteur</h2>
          <button (click)="closeModal()" class="text-gray-500 hover:text-gray-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Form Content -->
        <div class="p-6 space-y-6">
          <p class="text-gray-600">Enregistrez les informations du visiteur pour l'enregistrement</p>

          <!-- Name -->
          <div>
            <label class="block text-sm font-semibold text-gray-900 mb-2">Nom complet <span class="text-red-500">*</span></label>
            <input
              type="text"
              [value]="form().name"
              (input)="updateForm('name', $any($event.target).value)"
              placeholder="Jean Dupont"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <!-- Company and Host Row -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">Entreprise <span class="text-red-500">*</span></label>
              <input
                type="text"
                [value]="form().company"
                (input)="updateForm('company', $any($event.target).value)"
                placeholder="Nom de l'entreprise"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">Hôte <span class="text-red-500">*</span></label>
              <input
                type="text"
                [value]="form().host"
                (input)="updateForm('host', $any($event.target).value)"
                placeholder="Nom de l'hôte"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          <!-- Reason -->
          <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Motif de visite</label>
              <select
                [value]="form().reason"
                (change)="updateForm('reason', $any($event.target).value)"
                name="purpose"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
              >
                <option value="">Sélectionnez un motif</option>
                <option value="Réunion client">Réunion client</option>
                <option value="Entretien d'embauche">Entretien d'embauche</option>
                <option value="Livraison">Livraison</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Visite guidée">Visite guidée</option>
                <option value="Consultation">Consultation</option>
                <option value="Formation">Formation</option>
                <option value="Autre">Autre</option>
              </select>
            </div>

          <!-- Dates and Times -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">Date d'entrée <span class="text-red-500">*</span></label>
              <input
                type="date"
                [value]="form().arrivalDate"
                (input)="updateForm('arrivalDate', $any($event.target).value)"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">Heure d'entrée <span class="text-red-500">*</span></label>
              <input
                type="time"
                [value]="form().arrivalTime"
                (input)="updateForm('arrivalTime', $any($event.target).value)"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">Date de sortie <span class="text-red-500">*</span></label>
              <input
                type="date"
                [value]="form().departureDate"
                (input)="updateForm('departureDate', $any($event.target).value)"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">Heure de sortie <span class="text-red-500">*</span></label>
              <input
                type="time"
                [value]="form().departureTime"
                (input)="updateForm('departureTime', $any($event.target).value)"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          <!-- Email and Phone Row -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">Email <span class="text-red-500">*</span></label>
              <input
                type="email"
                [value]="form().email"
                (input)="updateForm('email', $any($event.target).value)"
                placeholder="jean@example.com"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">Téléphone <span class="text-red-500">*</span></label>
              <input
                type="tel"
                [value]="form().phone"
                (input)="updateForm('phone', $any($event.target).value)"
                placeholder="+33 6 12 34 56 78"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
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
            (click)="nextStep()"
            class="px-6 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class NewVisitorModalComponent {
  form = signal<VisitorForm>({
    name: '',
    company: '',
    email: '',
    phone: '',
    arrivalDate: '',
    arrivalTime: '',
    departureDate: '',
    departureTime: '',
    host: '',
    reason: ''
  });

  closed = output<void>();
  submitted = output<{form: VisitorForm}>();

  closeModal() {
    this.closed.emit();
  }

  nextStep() {
    const formValue = this.form();
    if (this.isFormValid(formValue)) {
      this.submitted.emit({ form: formValue });
    } else {
      alert('Veuillez remplir tous les champs requis');
    }
  }

  private isFormValid(form: VisitorForm): boolean {
    return !!(
      form.name &&
      form.company &&
      form.email &&
      form.phone &&
      form.arrivalDate &&
      form.arrivalTime &&
      form.departureDate &&
      form.departureTime &&
      form.host &&
      form.reason
    );
  }

  updateForm(field: string, value: any) {
    this.form.update(f => ({
      ...f,
      [field]: value
    }));
  }
}
