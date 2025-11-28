import { Injectable, signal } from '@angular/core';

export interface Visitor {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  host: string;
  reason: string;
  status: 'present' | 'left';
  arrivalTime: string;
  departureTime?: string;
  arrivalDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class VisitorService {
  private visitors = signal<Visitor[]>([
    {
      id: '1',
      name: 'Jean Moreau',
      email: 'jean.moreau@company.com',
      phone: '+33 6 12 34 56 78',
      company: 'Consulting Group',
      host: 'Marie Dupont',
      reason: 'Business Meeting',
      status: 'present',
      arrivalTime: '14:00',
      arrivalDate: '2024-01-15',
    },
    {
      id: '2',
      name: 'Sophie Bernard',
      email: 'sophie.bernard@company.com',
      phone: '+33 6 23 45 67 89',
      company: 'Tech Solutions',
      host: 'Pierre Martin',
      reason: 'Technical Review',
      status: 'left',
      arrivalTime: '10:30',
      departureTime: '12:00',
      arrivalDate: '2024-01-15',
    },
    {
      id: '3',
      name: 'Marc Lefevre',
      email: 'marc.lefevre@company.com',
      phone: '+33 6 34 56 78 90',
      company: 'Finance Corp',
      host: 'Luc Dupuis',
      reason: 'Audit',
      status: 'present',
      arrivalTime: '09:15',
      arrivalDate: '2024-01-15',
    },
  ]);

  getVisitors() {
    return this.visitors.asReadonly();
  }

  getTotalVisitors() {
    return this.visitors().length;
  }

  getPresentVisitors() {
    return this.visitors().filter(v => v.status === 'present').length;
  }

  addVisitor(visitor: Omit<Visitor, 'id'>) {
    const newVisitor: Visitor = {
      ...visitor,
      id: Math.random().toString(36).substr(2, 9)
    };
    this.visitors.update(v => [...v, newVisitor]);
  }

  updateVisitor(id: string, visitor: Partial<Visitor>) {
    this.visitors.update(v => 
      v.map(vis => vis.id === id ? { ...vis, ...visitor } : vis)
    );
  }

  deleteVisitor(id: string) {
    this.visitors.update(v => v.filter(vis => vis.id !== id));
  }
}
