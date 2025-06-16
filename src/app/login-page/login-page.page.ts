import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, AlertController, ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service'; // Import your Auth Service

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.page.html',
  styleUrls: ['./login-page.page.scss'],
  standalone: false
})
export class LoginPagePage implements OnInit {

  email!: string; // Using definite assignment assertion
  password!: string; // Using definite assignment assertion
  errorMessage: string | null = null;

  constructor(
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private toastController: ToastController,
    private authService: AuthService // Inject AuthService
  ) { }

  ngOnInit() {
  }

  async login() {
    this.errorMessage = null; // Clear previous error message

    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter both email and password.';
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Logging in...',
    });
    await loading.present();

    try {
      let data = await this.authService.login({ email: this.email, password: this.password })
      if (data) {
        await loading.dismiss();
        // The authService.login method already handles setting the token and user
        const toast = await this.toastController.create({
          message: 'Login successful!',
          duration: 2000,
          color: 'success'
        });
        toast.present();
        this.router.navigateByUrl('/home');
      }
      
    } catch (err: any) {
      await loading.dismiss();
      console.error('Login Error:', err);

      if (err.status === 422 && err.error && err.error.errors) {
        const errors = err.error.errors;
        let errorMessages = '';
        for (const key in errors) {
          if (errors.hasOwnProperty(key)) {
            errorMessages += `${errors[key].join(', ')}\n`;
          }
        }
        this.errorMessage = errorMessages.trim();
        this.presentAlert('Validation Error', this.errorMessage);
      } else if (err.status === 401) {
        this.errorMessage = 'Incorrect email or password.';
        this.presentAlert('Login Failed', 'The email and password provided do not match our records.');
      } else {
        this.errorMessage = 'An unexpected error occurred. Please try again later.';
        this.presentAlert('Error', 'Could not connect to the server or an unexpected error occurred.');
      }
    }
  }

  // Helper to present Ionic Alert
  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }

}
