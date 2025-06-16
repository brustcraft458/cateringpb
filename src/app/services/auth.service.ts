import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators'; // Import tap for side effects
import { firstValueFrom } from 'rxjs';
import { Storage } from '@ionic/storage-angular'; // Import Ionic Storage
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Import HttpClient

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _isLoggedIn = false;
  private _token: string | null = null;
  private _apiUrl: string = environment.apiUrl;

  async isLoggedIn() {
    await this.init();
    return this._isLoggedIn;
  }

  async getToken() {
    await this.init();
    return this._token;
  }

  async getUser() {
    await this.init();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this._token}`
    });
    return firstValueFrom(this.http.get<any>(`${this._apiUrl}/user`, { headers: headers }));
  }

  constructor(private storage: Storage, private http: HttpClient) { // Inject HttpClient
    this.init();
  }

  async init() {
    if (this._token) {
      return;
    }

    await this.storage.create();
    await this.loadInitialData();
  }

  private async loadInitialData() {
    const token = await this.storage.get('authToken');
    console.log('storage: ' + token)
    if (token) {
      this._token = token;
      this._isLoggedIn = true;
    }
  }

  async setLoggedIn(value: boolean) {
    this._isLoggedIn = value;
    if (!value) {
      await this.storage.remove('authToken');
      this._token = null;
    }
  }

  async setToken(token: string) {
    this._token = token;
    await this.storage.set('authToken', token);
  }

  // New login method in AuthService
  login(credentials: { email: string, password: string }) {
    return firstValueFrom(
      this.http.post(`${this._apiUrl}/login`, credentials).pipe(
        tap((response: any) => {
          if (response && response.token) {
            this.setLoggedIn(true);
            this.setToken(response.token);
          }
        })
      )
    );
  }

  async logout() {
    await this.setLoggedIn(false);
  }
}
