import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FoodService } from '../services/food.service';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.page.html',
  styleUrls: ['./qr-code.page.scss'],
  standalone: false
})
export class QrCodePage implements OnInit, AfterViewInit {
  qrSize: number = 256;
  qrTask: any;

  constructor(
    private router: Router,
    private foodService: FoodService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    
  }

  ionViewWillLeave() {
    console.log('destroyy leave')
    clearInterval(this.qrTask);
  }

  ngAfterViewInit() {
    this.generateQRCode();

    this.qrTask = setInterval(async () => {
      console.log('QR code has expired, refreshh');
      await this.generateQRCode();
    }, 13000);
  }

  async generateQRCode() {
    const canvas = document.querySelector('#qrCodeCanvas') as HTMLCanvasElement;
    canvas.width = this.qrSize;
    canvas.height = this.qrSize;

    let response = await this.foodService.getQrCode();

    QRCode.toCanvas(canvas, response.qr_token, {
      width: this.qrSize,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M'
    }, (error) => {
      if (error) {
        console.error('Error generating QR code:', error);
      } else {
        console.log('QR Code generated successfully!');
      }
    });
  }

  navigateTo(path: string) {
    this.router.navigateByUrl(path);
  }
}