import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface MenuItem {
  label: string;
  path: string;
  icon: string;
  roles?: string[];
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './main-layout.component.html'
})
export class MainLayoutComponent {
  currentUser = signal<any>(null);
  sidebarCollapsed = signal<boolean>(false);
  activeOptions = { exact: false };

  menuItems = signal<MenuItem[]>([
    {
      label: 'Tableau de bord',
      path: '/dashboard',
      icon: '📊',
      roles: ['admin', 'mg', 'it', 'collaborator']
    },
    {
      label: 'Demandes de visites',
      path: '/requests',
      icon: '📋',
      roles: ['admin', 'mg', 'it', 'collaborator']
    },
    {
      label: 'Visiteurs',
      path: '/visitors',
      icon: '👥',
      roles: ['admin', 'mg', 'it', 'collaborator']
    },
    {
      label: 'Administration',
      path: '/admin',
      icon: '⚙️',
      roles: ['admin']
    }
  ]);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser.set(this.authService.getCurrentUser()());
  }

  toggleSidebar() {
    this.sidebarCollapsed.update(collapsed => !collapsed);
  }

  handleLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}