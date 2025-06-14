import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Storage } from '@ionic/storage-angular'; // Import Ionic Storage
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _isLoggedIn = new BehaviorSubject<boolean>(false);
  private _token = new BehaviorSubject<string | null>(null);
  private _user = new BehaviorSubject<any>(null); // To store user data
  private apiUrl = environment.apiUrl;

  // Public observables for components to subscribe to
  get isLoggedIn() {
    return this._isLoggedIn.asObservable();
  }

  get token() {
    return this._token.asObservable();
  }

  get user() {
    return this._user.asObservable();
  }

  constructor(private storage: Storage) {
    this.init(); // Initialize storage and load any existing data
  }

  async init() {
    // Ensure the storage is created/ready
    await this.storage.create();
    // Load initial data from storage
    await this.loadInitialData();
  }

  private async loadInitialData() {
    const token = await this.storage.get('authToken');
    const user = await this.storage.get('currentUser');
    if (token) {
      this._token.next(token);
      this._isLoggedIn.next(true); // Set login status if token exists
    }
    if (user) {
      this._user.next(user); // Set user data if exists
    }
  }

  async setLoggedIn(value: boolean) {
    this._isLoggedIn.next(value);
    if (!value) {
      // Clear stored data if logging out
      await this.storage.remove('authToken');
      await this.storage.remove('currentUser');
      this._token.next(null);
      this._user.next(null);
    }
  }

  async setToken(token: string) {
    this._token.next(token);
    await this.storage.set('authToken', token); // Store token in local storage
  }

  async setUser(user: any) {
    this._user.next(user);
    await this.storage.set('currentUser', user); // Store user data in local storage
  }

  async logout() {
    // Perform local logout
    await this.setLoggedIn(false);
    // You could optionally send a request to your Laravel API's /logout endpoint here
    // For example: this.http.post('http://localhost:8000/api/logout', {}, { headers: { 'Authorization': `Bearer ${token}` } }).subscribe();
  }
}
