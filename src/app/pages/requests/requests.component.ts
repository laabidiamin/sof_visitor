import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { RequestService, Request } from '../../services/request.service';
import { RejectionModalComponent } from '../../components/rejection-modal/rejection-modal.component';

@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [CommonModule, RejectionModalComponent],
  templateUrl: './requests.component.html'
})
export class RequestsComponent {
  currentUserRole = signal<string>('collaborator');
  rejectionRequestId = signal<string>('');
  rejectionTeam = signal<'mg' | 'it'>('mg');
  showRejectionModal = signal(false);

  requests = signal<Request[]>([]);
  
  pendingCount = computed(() => {
    return this.requests().filter(r => r.status === 'pending').length;
  });

  approvedCount = computed(() => {
    return this.requests().filter(r => r.status === 'approved').length;
  });

  rejectedCount = computed(() => {
    return this.requests().filter(r => r.status === 'rejected').length;
  });

  filteredRequests = computed(() => {
    const role = this.currentUserRole();
    const allRequests = this.requests();

    if (role === 'admin') {
      return allRequests;
    }
    if (role === 'collaborator') {
      return allRequests.filter(r => r.createdBy === 'current-user');
    }
    if (role === 'mg' || role === 'it') {
      return allRequests.filter(r => r.services.some(s => s.team === role));
    }
    return [];
  });

  constructor(private authService: AuthService, private requestService: RequestService) {
    const user = this.authService.getCurrentUser()();
    if (user) {
      this.currentUserRole.set(user.role);
    }
    this.requests.set(this.requestService.getRequests()());
  }

  approveRequest(requestId: string, team: 'mg' | 'it') {
    this.requestService.approveRequest(requestId, team);
    this.requests.set(this.requestService.getRequests()());
  }

  openRejectionModal(requestId: string, team: 'mg' | 'it') {
    this.rejectionRequestId.set(requestId);
    this.rejectionTeam.set(team);
    this.showRejectionModal.set(true);
  }

  closeRejectionModal() {
    this.showRejectionModal.set(false);
    this.rejectionRequestId.set('');
  }

  submitRejection(event: any) {
    this.requestService.rejectRequest(
      this.rejectionRequestId(),
      this.rejectionTeam(),
      event.comment
    );
    this.requests.set(this.requestService.getRequests()());
    this.closeRejectionModal();
  }

  formatStatus(status?: string): string {
    if (!status) return '';
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'approved':
        return 'Approuvé';
      case 'rejected':
        return 'Refusé';
      default:
        return status;
    }
  }

  canApproveMg(request: Request): boolean {
    return this.currentUserRole() === 'mg' &&
           request.services.some(s => s.team === 'mg') &&
           request.mgStatus === 'pending';
  }

  canApproveIt(request: Request): boolean {
    return this.currentUserRole() === 'it' &&
           request.services.some(s => s.team === 'it') &&
           request.itStatus === 'pending';
  }
}
