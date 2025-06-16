import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.page.html',
  styleUrls: ['./qr-code.page.scss'],
  standalone: false
})
export class QrCodePage implements OnInit, AfterViewInit {
  qrData: string = 'https://www.google.com/ionic'; // Data
  qrSize: number = 256;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    const canvas = document.querySelector('#qrCodeCanvas') as HTMLCanvasElement;

    if (canvas) {
      this.generateQRCode(canvas);
    } else {
      console.error('QR Code canvas element not found with document.querySelector!');
    }
  }

  generateQRCode(canvas: HTMLCanvasElement) {
    canvas.width = this.qrSize;
    canvas.height = this.qrSize;

    QRCode.toCanvas(canvas, this.qrData, {
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