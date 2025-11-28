import { Injectable, signal } from '@angular/core';

export interface Service {
  id: string;
  name: string;
  icon: string;
  description: string;
  team: 'mg' | 'it';
}

export interface Request {
  id: string;
  visitorId: string;
  visitorName: string;
  company: string;
  email: string;
  phone: string;
  services: Service[];
  createdBy: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
  mgStatus?: 'pending' | 'approved' | 'rejected';
  itStatus?: 'pending' | 'approved' | 'rejected';
  mgComment?: string;
  itComment?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  
  availableServices = signal<Service[]>([
    {
      id: 'badge',
      name: 'Smart Badge',
      icon: '🏷️',
      description: 'RFID enabled visitor badge with photo and QR code',
      team: 'mg'
    },
    {
      id: 'room-booking',
      name: 'Room Booking',
      icon: '🏢',
      description: 'Reserve meeting rooms with A/V equipment',
      team: 'mg'
    },
    {
      id: 'parking',
      name: 'Parking',
      icon: '🚗',
      description: 'Reserved parking spot with GPS guidance',
      team: 'mg'
    },
    {
      id: 'translation',
      name: 'Translation',
      icon: '✈️',
      description: 'Professional interpreter services',
      team: 'mg'
    },
    {
      id: 'wifi',
      name: 'Premium WiFi',
      icon: '📡',
      description: 'High-speed internet with priority bandwidth',
      team: 'it'
    },
    {
      id: 'tech-support',
      name: 'Tech Support',
      icon: '🎧',
      description: 'Dedicated IT support during visit',
      team: 'it'
    }
  ]);

  private requests = signal<Request[]>([]);

  getRequests() {
    return this.requests.asReadonly();
  }

  getRequestsByRole(role: 'mg' | 'it' | 'admin' | 'collaborator') {
    return this.requests().filter(request => {
      if (role === 'admin') {
        return true;
      }
      if (role === 'collaborator') {
        return request.createdBy === 'current-user'; // In real app, get from AuthService
      }
      if (role === 'mg') {
        return request.services.some(s => s.team === 'mg');
      }
      if (role === 'it') {
        return request.services.some(s => s.team === 'it');
      }
      return false;
    });
  }

  createRequest(request: Omit<Request, 'id' | 'createdAt'>) {
    const newRequest: Request = {
      ...request,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      status: 'pending',
      mgStatus: request.services.some(s => s.team === 'mg') ? 'pending' : undefined,
      itStatus: request.services.some(s => s.team === 'it') ? 'pending' : undefined
    };
    
    this.requests.update(r => [...r, newRequest]);
    return newRequest;
  }

  approveRequest(requestId: string, team: 'mg' | 'it') {
    this.requests.update(requests => 
      requests.map(r => {
        if (r.id === requestId) {
          const updated = { ...r };
          if (team === 'mg') {
            updated.mgStatus = 'approved';
          } else {
            updated.itStatus = 'approved';
          }
          // Check if both teams approved (if applicable)
          updated.status = this.calculateStatus(updated);
          return updated;
        }
        return r;
      })
    );
  }

  rejectRequest(requestId: string, team: 'mg' | 'it', comment: string) {
    this.requests.update(requests => 
      requests.map(r => {
        if (r.id === requestId) {
          const updated = { ...r };
          if (team === 'mg') {
            updated.mgStatus = 'rejected';
            updated.mgComment = comment;
          } else {
            updated.itStatus = 'rejected';
            updated.itComment = comment;
          }
          updated.status = 'rejected';
          return updated;
        }
        return r;
      })
    );
  }

  private calculateStatus(request: Request): 'pending' | 'approved' | 'rejected' {
    const needsMg = request.services.some(s => s.team === 'mg');
    const needsIt = request.services.some(s => s.team === 'it');

    if (needsMg && needsIt) {
      if (request.mgStatus === 'rejected' || request.itStatus === 'rejected') {
        return 'rejected';
      }
      if (request.mgStatus === 'approved' && request.itStatus === 'approved') {
        return 'approved';
      }
      return 'pending';
    } else if (needsMg) {
      return request.mgStatus === 'approved' ? 'approved' : request.mgStatus === 'rejected' ? 'rejected' : 'pending';
    } else if (needsIt) {
      return request.itStatus === 'approved' ? 'approved' : request.itStatus === 'rejected' ? 'rejected' : 'pending';
    }
    return 'pending';
  }

  getPendingCount(): number {
    return this.requests().filter(r => r.status === 'pending').length;
  }

  getApprovedCount(): number {
    return this.requests().filter(r => r.status === 'approved').length;
  }

  getRejectedCount(): number {
    return this.requests().filter(r => r.status === 'rejected').length;
  }
}
