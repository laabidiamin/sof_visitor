import { Injectable, signal } from '@angular/core';

export interface User {
  id: string;
  username: string;
  role: 'admin' | 'mg' | 'it' | 'collaborator';
  email: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser = signal<User | null>(null);
  
  isAuthenticated = signal(false);

  constructor() {
    this.loadStoredUser();
  }

  private loadStoredUser() {
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      this.currentUser.set(JSON.parse(stored));
      this.isAuthenticated.set(true);
    }
  }

  getCurrentUser() {
    return this.currentUser.asReadonly();
  }

  login(username: string, role: 'admin' | 'mg' | 'it' | 'collaborator') {
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      username,
      role,
      email: `${username}@company.com`,
      name: username.charAt(0).toUpperCase() + username.slice(1)
    };
    
    this.currentUser.set(user);
    this.isAuthenticated.set(true);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  logout() {
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    localStorage.removeItem('currentUser');
  }
}
