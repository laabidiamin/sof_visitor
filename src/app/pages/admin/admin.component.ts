import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'mg' | 'it' | 'collaborator';
  status: 'active' | 'inactive';
  createdAt: string;
  lastLogin: string;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  users = signal<User[]>([
    {
      id: 1,
      name: 'Admin Principal',
      email: 'admin@example.com',
      role: 'admin',
      status: 'active',
      createdAt: '01/01/2024',
      lastLogin: '20/11/2025 11:36'
    },
    {
      id: 2,
      name: 'Jean Martin',
      email: 'jean.martin@example.com',
      role: 'mg',
      status: 'active',
      createdAt: '15/03/2024',
      lastLogin: '10/11/2025 08:30'
    },
    {
      id: 3,
      name: 'Sophie Bernard',
      email: 'sophie.bernard@example.com',
      role: 'it',
      status: 'active',
      createdAt: '20/06/2024',
      lastLogin: '09/11/2025 14:20'
    },
    {
      id: 4,
      name: 'Marc Durand',
      email: 'marc.durand@example.com',
      role: 'collaborator',
      status: 'inactive',
      createdAt: '10/09/2024',
      lastLogin: '15/10/2025 00:00'
    }
  ]);

  filteredUsers = signal<User[]>(this.users());
  searchQuery = '';
  showModal = signal(false);
  editingUser = signal<User | null>(null);

  formData = {
    name: '',
    email: '',
    role: 'collaborator' as User['role'],
    status: 'active' as User['status']
  };

  countByRole(role: string): number {
    return this.users().filter(u => u.role === role).length;
  }

  countByStatus(status: string): number {
    return this.users().filter(u => u.status === status).length;
  }

  getRoleBadgeClass(role: string): string {
    const classes: Record<string, string> = {
      admin: 'bg-purple-100 text-purple-700',
      mg: 'bg-blue-100 text-blue-700',
      it: 'bg-green-100 text-green-700',
      collaborator: 'bg-gray-100 text-gray-700'
    };
    return classes[role] ;
  }

  getRoleIcon(role: string): string {
    const icons: Record<string, string> = {
      admin: '👑',
      mg: '⭕',
      it: '💻',
      collaborator: '👤'
    };
    return icons[role] || 'User';
  }

  getRoleLabel(role: string): string {
    const labels: Record<string, string> = {
      admin: 'Administrateur',
      mg: 'Manager',
      it: 'IT',
      collaborator: 'Utilisateur'
    };
    return labels[role] || 'Utilisateur';
  }

  filterUsers(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredUsers.set(
      this.users().filter(u =>
        u.name.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query)
      )
    );
  }

  openCreateModal(): void {
    this.editingUser.set(null);
    this.formData = { name: '', email: '', role: 'collaborator', status: 'active' };
    this.showModal.set(true);
  }

  editUser(user: User): void {
    this.editingUser.set(user);
    this.formData = { ...user };
    this.showModal.set(true);
  }

  deleteUser(user: User): void {
    if (confirm(`Supprimer ${user.name} ?`)) {
      this.users.update(users => users.filter(u => u.id !== user.id));
      this.filterUsers();
    }
  }

  saveUser(): void {
    if (this.editingUser()) {
      this.users.update(users =>
        users.map(u => u.id === this.editingUser()!.id ? { ...u, ...this.formData } : u)
      );
    } else {
      const newUser: User = {
        id: Math.max(...this.users().map(u => u.id), 0) + 1,
        ...this.formData,
        createdAt: new Date().toLocaleDateString('fr-FR'),
        lastLogin: 'Jamais'
      };
      this.users.update(users => [...users, newUser]);
    }
    this.filterUsers();
    this.closeModal();
  }

  closeModal(): void {
    this.showModal.set(false);
    this.editingUser.set(null);
  }
}