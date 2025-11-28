import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  username = signal('');
  password = signal('');
  selectedRole = signal<'admin' | 'mg' | 'it' | 'collaborator'>('collaborator');
  error = signal('');

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  handleLogin() {
    if (!this.username()) {
      this.error.set('Username is required');
      return;
    }

    this.authService.login(this.username(), this.selectedRole());
    this.router.navigate(['/dashboard']);
  }
}
