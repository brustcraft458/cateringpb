import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Role {
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

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  roles: Role[];
  karyawan: any | null; // Sesuaikan tipe data jika karyawan memiliki struktur spesifik
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl; // Pastikan Anda mengatur apiUrl di environment.ts
  constructor(private http: HttpClient) { }

  getUserProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/user`);
  }
}
