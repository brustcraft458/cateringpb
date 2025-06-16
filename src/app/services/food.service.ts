// src/app/services/food.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular'; // Import Ionic Storage
import { Observable } from 'rxjs'; // Import Observable
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment'; // Asumsi Anda memiliki environment

// Interface untuk respons API QR Code
export interface QrCodeResponse {
  qr_token: string;
  expired_at: string; // ISO 8601 string
}

@Injectable({
  providedIn: 'root' // Ini membuat service tersedia di seluruh aplikasi (singleton)
})
export class FoodService {
  private _isLoggedIn = false;
  private _token: string | null = null;
  private _apiUrl: string = environment.apiUrl;
  constructor(private storage: Storage, private http: HttpClient) { }

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

  async getQrCode() {
    await this.init();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this._token}`
    });

    return firstValueFrom(this.http.post<any>(`${this._apiUrl}/karyawan/qr-code/generate`, {},  { headers: headers }));
  }
}