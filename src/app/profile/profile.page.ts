import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false
})
export class ProfilePage implements OnInit {

  // Define an interface for better type safety
  user: User | undefined;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    let user = await this.authService.getUser();
    this.user = user;
  }

  // Helper to format dates if needed (optional)
  formatDate(dateString: string | null): string {
    if (!dateString) {
      return 'N/A';
    }
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Helper to get role names
  getRoleNames(): string {
    return this.user?.roles.map(role => role.name).join(', ') || 'No roles';
  }

  navigateTo(path: string) {
    this.router.navigateByUrl(path);
  }
}

// Interfaces to strongly type your data
interface Role {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  pivot: {
    model_type: string;
    model_id: number;
    role_id: number;
  };
}

interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  roles: Role[];
  karyawan: any; // You might want to define a more specific type for 'karyawan' if it's not always null
}