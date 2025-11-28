import { Component, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { Table } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { VisitorService } from '../../services/visitor.service';
import { RequestService } from '../../services/request.service';
import { NewVisitorModalComponent } from '../../components/new-visitor-modal/new-visitor-modal.component';
import { ServicesModalComponent } from '../../components/services-modal/services-modal.component';

interface Visitor {
  id: number;
  nom: string;
  entreprise: string;
  email: string;
  telephone: string;
  hote: string;
  arrivee: string;
  depart: string;
  statut: 'Présent' | 'Parti';
}

@Component({
  selector: 'app-visitors',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TagModule,
    MenuModule,
    NewVisitorModalComponent,
    ServicesModalComponent
  ],
  templateUrl: './visitors.component.html',
  styleUrl: './visitors.component.css'
})
export class VisitorsComponent {
  @ViewChild('menu') menu: any;
  
  showNewVisitorModal = signal(false);
  showServicesModal = signal(false);
  visitorFormData = signal<any>(null);
  loading = signal(false);
  selectedVisitor = signal<Visitor | null>(null);
  
  visitors = signal<Visitor[]>([
    {
      id: 1,
      nom: 'Marie Dupont',
      entreprise: 'Tech Solutions',
      email: 'marie.dupont@example.com',
      telephone: '+33 6 12 34 56 78',
      hote: 'Jean Martin',
      arrivee: '10/11/2025 09:30',
      depart: '',
      statut: 'Présent'
    },
    {
      id: 2,
      nom: 'Pierre Martin',
      entreprise: 'Logistics Inc',
      email: 'pierre.martin@example.com',
      telephone: '+33 6 87 65 43 21',
      hote: 'Sophie Bernard',
      arrivee: '10/11/2025 10:15',
      depart: '10/11/2025 11:45',
      statut: 'Parti'
    },
    {
      id: 3,
      nom: 'Sophie Laurent',
      entreprise: 'Design Studio',
      email: 'sophie.laurent@example.com',
      telephone: '+33 6 34 85 18 22',
      hote: 'Marc Durand',
      arrivee: '10/11/2025 11:00',
      depart: '',
      statut: 'Présent'
    },
    {
      id: 4,
      nom: 'Jean Moreau',
      entreprise: 'Consulting Group',
      email: 'jean.moreau@example.com',
      telephone: '+33 6 11 22 33 44',
      hote: 'Alice Petit',
      arrivee: '10/11/2025 14:00',
      depart: '',
      statut: 'Présent'
    },
    {
      id: 5,
      nom: 'Alice Bernard',
      entreprise: 'Tech Solutions',
      email: 'alice.bernard@example.com',
      telephone: '+33 6 55 44 33 22',
      hote: 'Jean Martin',
      arrivee: '09/11/2025 14:30',
      depart: '09/11/2025 16:00',
      statut: 'Parti'
    },
    {
      id: 6,
      nom: 'Thomas Petit',
      entreprise: 'Innovation Labs',
      email: 'thomas.petit@example.com',
      telephone: '+33 6 99 88 77 66',
      hote: 'Sophie Bernard',
      arrivee: '08/11/2025 10:00',
      depart: '08/11/2025 12:30',
      statut: 'Parti'
    }
  ]);

  actionItems = signal<MenuItem[]>([
    {
      label: 'Voir les détails',
      icon: 'pi pi-eye',
      command: () => this.viewVisitor()
    },
    {
      label: 'Modifier',
      icon: 'pi pi-pencil',
      command: () => this.editVisitor()
    },
    {
      separator: true
    },
    {
      label: 'Marquer comme parti',
      icon: 'pi pi-sign-out',
      command: () => this.markAsLeft()
    },
    {
      separator: true
    },
    {
      label: 'Supprimer',
      icon: 'pi pi-trash',
      command: () => this.deleteVisitor(),
      styleClass: 'text-red-600'
    }
  ]);
  constructor(
    private visitorService: VisitorService,
    private requestService: RequestService
  ) {}


  openNewVisitorModal() {
    this.showNewVisitorModal.set(true);
  }

  closeNewVisitorModal() {
    this.showNewVisitorModal.set(false);
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
    console.log('Services sélectionnés :', event);
    
    // Ajouter le nouveau visiteur à la liste
    const newVisitor: Visitor = {
      id: Math.max(...this.visitors().map(v => v.id)) + 1,
      nom: this.visitorFormData()?.nom || 'Nouveau Visiteur',
      entreprise: this.visitorFormData()?.entreprise || '-',
      email: this.visitorFormData()?.email || '-',
      telephone: this.visitorFormData()?.telephone || '-',
      hote: this.visitorFormData()?.hote || '-',
      arrivee: new Date().toLocaleString('fr-FR'),
      depart: '',
      statut: 'Présent'
    };
    
    this.visitors.update(visitors => [newVisitor, ...visitors]);
    this.requestService.createRequest({
      visitorId: Math.random().toString(36).substr(2, 9),
      visitorName: form.name,
      company: form.company,
      email: form.email,
      phone: form.phone,
      services: services,
      createdBy: 'current-user',
      status: 'pending'
    });
    this.closeServicesModal();
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    const input = document.querySelector('input[type="text"]') as HTMLInputElement;
    if (input) input.value = '';
  }

  showActions(event: Event, visitor: Visitor) {
    this.selectedVisitor.set(visitor);
    this.menu.toggle(event);
  }

  viewVisitor() {
    console.log('Voir détails:', this.selectedVisitor());
  }

  editVisitor() {
    console.log('Modifier:', this.selectedVisitor());
  }

  markAsLeft() {
    const visitor = this.selectedVisitor();
    if (visitor) {
      this.visitors.update(visitors =>
        visitors.map(v =>
          v.id === visitor.id
            ? { ...v, statut: 'Parti', depart: new Date().toLocaleString('fr-FR') }
            : v
        )
      );
    }
  }

  deleteVisitor() {
    const visitor = this.selectedVisitor();
    if (visitor && confirm(`Êtes-vous sûr de vouloir supprimer ${visitor.nom} ?`)) {
      this.visitors.update(visitors => visitors.filter(v => v.id !== visitor.id));
    }
  }

  exportExcel() {
    // Logique d'export Excel à implémenter
    console.log('Export Excel des visiteurs');
  }
}