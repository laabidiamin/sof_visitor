import { Component, signal, output, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestService, Service } from '../../services/request.service';

@Component({
  selector: 'app-services-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-3xl">
        <!-- Header -->
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-2xl font-bold text-gray-900">Services additionnels</h2>
          <p class="text-gray-600 mt-2">Sélectionnez les services souhaités pour ce visiteur</p>
        </div>

        <!-- Services Grid -->
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ng-container *ngFor="let service of availableServices()">
              <div
                (click)="toggleService(service)"
                [class.ring-2]="isSelected(service.id)"
                [class.ring-blue-500]="isSelected(service.id)"
                [class.bg-blue-50]="isSelected(service.id)"
                class="p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition"
              >
                <div class="flex items-start justify-between mb-2">
                  <span class="text-3xl">{{ service.icon }}</span>
                  <input
                    type="checkbox"
                    [checked]="isSelected(service.id)"
                    (click)="$event.stopPropagation()"
                    class="w-5 h-5 rounded border-gray-300 text-blue-600"
                  />
                </div>
                <h3 class="font-semibold text-gray-900 mb-1">{{ service.name }}</h3>
                <p class="text-sm text-gray-600 mb-2">{{ service.description }}</p>
                <span class="inline-block text-xs font-medium px-2 py-1 rounded-full"
                      [class.bg-purple-100]="service.team === 'mg'"
                      [class.text-purple-800]="service.team === 'mg'"
                      [class.bg-blue-100]="service.team === 'it'"
                      [class.text-blue-800]="service.team === 'it'"
                >
                  {{ service.team === 'mg' ? 'MG Team' : 'IT Team' }}
                </span>
              </div>
            </ng-container>
          </div>
        </div>

        <!-- Selected Services Summary -->
        <div *ngIf="selectedServices().length > 0" class="px-6 py-4 bg-blue-50 border-t border-gray-200">
          <p class="text-sm font-medium text-gray-900 mb-2">Services sélectionnés :</p>
          <div class="flex flex-wrap gap-2">
            <ng-container *ngFor="let serviceId of selectedServices()">
              <span class="inline-block bg-white border border-blue-300 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                {{ getServiceName(serviceId) }}
              </span>
            </ng-container>
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
            (click)="submit()"
            [disabled]="selectedServices().length === 0"
            [class.opacity-50]="selectedServices().length === 0"
            [class.cursor-not-allowed]="selectedServices().length === 0"
            class="px-6 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition disabled:hover:bg-black"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ServicesModalComponent {
  visitorForm = input<any>();
  
  selectedServices = signal<string[]>([]);
  availableServices = signal<Service[]>([]);

  closed = output<void>();
  submitted = output<{services: Service[]}>();

  constructor(private requestService: RequestService) {
    this.availableServices.set(this.requestService.availableServices());
  }

  toggleService(service: Service) {
    this.selectedServices.update(services => {
      const index = services.indexOf(service.id);
      if (index > -1) {
        return services.filter((_, i) => i !== index);
      } else {
        return [...services, service.id];
      }
    });
  }

  isSelected(serviceId: string): boolean {
    return this.selectedServices().includes(serviceId);
  }

  getServiceName(serviceId: string): string {
    return this.availableServices().find(s => s.id === serviceId)?.name || '';
  }

  closeModal() {
    this.closed.emit();
  }

  submit() {
    const selectedServiceObjects = this.availableServices().filter(s => 
      this.selectedServices().includes(s.id)
    );
    this.submitted.emit({ services: selectedServiceObjects });
  }
}
