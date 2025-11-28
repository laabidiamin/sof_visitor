import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisitorService } from '../../services/visitor.service';
import { RequestService } from '../../services/request.service';
import { NewVisitorModalComponent } from '../../components/new-visitor-modal/new-visitor-modal.component';
import { ServicesModalComponent } from '../../components/services-modal/services-modal.component';

interface Activity {
  id: string;
  name: string;
  company: string;
  action: string;
  time: string;
  avatar: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NewVisitorModalComponent, ServicesModalComponent],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  showNewVisitorModal = signal(false);
  showServicesModal = signal(false);
  visitorFormData = signal<any>(null);

  visitorService = signal<VisitorService | null>(null);
  requestService = signal<RequestService | null>(null);
  visitors = signal<any[]>([]);
  
  totalVisitors = computed(() => {
    return this.visitors().length;
  });
  
  presentVisitors = computed(() => {
    return this.visitors().filter(v => v.status === 'present').length;
  });

  pendingRequests = computed(() => {
    return this.requestService()?.getPendingCount() || 0;
  });

  recentActivity = signal<Activity[]>([
    {
      id: '1',
      name: 'Jean Moreau',
      company: 'Consulting Group',
      action: 'Arrivée',
      time: '14:00',
      avatar: '#8B5CF6'
    },
    {
      id: '2',
      name: 'Sophie Bernard',
      company: 'Tech Solutions',
      action: 'Départ',
      time: '12:00',
      avatar: '#EC4899'
    },
    {
      id: '3',
      name: 'Marc Lefevre',
      company: 'Finance Corp',
      action: 'Arrivée',
      time: '09:15',
      avatar: '#3B82F6'
    }
  ]);

  constructor(visitorService: VisitorService, requestService: RequestService) {
    this.visitorService.set(visitorService);
    this.requestService.set(requestService);
    this.visitors.set(visitorService.getVisitors()());
  }

  openNewVisitorModal() {
    this.showNewVisitorModal.set(true);
  }

  closeNewVisitorModal() {
    this.showNewVisitorModal.set(false);
    this.visitorFormData.set(null);
  }

  onVisitorFormSubmitted(event: any) {
    this.visitorFormData.set(event.form);
    this.showNewVisitorModal.set(false);
    this.showServicesModal.set(true);
  }

  closeServicesModal() {
    this.showServicesModal.set(false);
    this.visitorFormData.set(null);
  }

  onServicesSelected(event: any) {
    const form = this.visitorFormData();
    const services = event.services;

    // Create a new visitor
    const newVisitor = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      company: form.company,
      host: form.host,
      reason: form.reason,
      status: 'present' as const,
      arrivalTime: form.arrivalTime,
      arrivalDate: form.arrivalDate,
      departureTime: form.departureTime
    };

    this.visitorService()?.addVisitor(newVisitor);

    // Create a request for the services
    const request = this.requestService()?.createRequest({
      visitorId: Math.random().toString(36).substr(2, 9),
      visitorName: form.name,
      company: form.company,
      email: form.email,
      phone: form.phone,
      services: services,
      createdBy: 'current-user',
      status: 'pending'
    });

    // Close the modal and reset
    this.closeServicesModal();
    
    // Refresh visitor list
    this.visitors.set(this.visitorService()?.getVisitors()() || []);
  }
}
