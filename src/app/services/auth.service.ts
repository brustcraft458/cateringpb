import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators'; // Import tap for side effects
import { Storage } from '@ionic/storage-angular'; // Import Ionic Storage
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http'; // Import HttpClient

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _isLoggedIn = new BehaviorSubject<boolean>(false);
  private _token = new BehaviorSubject<string | null>(null);
  private _user = new BehaviorSubject<any>(null);
  private _apiUrl = environment.apiUrl;

  get isLoggedIn() {
    return this._isLoggedIn.asObservable();
  }

  get token() {
    return this._token.asObservable();
  }

  get user() {
    return this._user.asObservable();
  }

  constructor(private storage: Storage, private http: HttpClient) { // Inject HttpClient
    this.init();
  }

  async init() {
    await this.storage.create();
    await this.loadInitialData();
  }

  private async loadInitialData() {
    const token = await this.storage.get('authToken');
    const user = await this.storage.get('currentUser');
    if (token) {
      this._token.next(token);
      this._isLoggedIn.next(true);
    }
    if (user) {
      this._user.next(user);
    }
  }

  async setLoggedIn(value: boolean) {
    this._isLoggedIn.next(value);
    if (!value) {
      await this.storage.remove('authToken');
      await this.storage.remove('currentUser');
      this._token.next(null);
      this._user.next(null);
    }
  }

  async setToken(token: string) {
    this._token.next(token);
    await this.storage.set('authToken', token);
  }

  async setUser(user: any) {
    this._user.next(user);
    await this.storage.set('currentUser', user);
  }

  // New login method in AuthService
  login(credentials: { email: string, password: string }): Observable<any> {
    const apiUrl = this._apiUrl + '/login'; // Your Laravel API login endpoint

    return this.http.post(apiUrl, credentials).pipe(
      tap((response: any) => {
        if (response && response.token) {
          this.setLoggedIn(true);
          this.setToken(response.token);
          this.setUser(response.user);
        }
      })
    );
  }

  async logout() {
    await this.setLoggedIn(false);
  }
}
