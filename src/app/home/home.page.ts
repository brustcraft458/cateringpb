import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    let user = await this.authService.getUser();
    console.log(user)
  }

  navigateTo(path: string) {
    this.router.navigateByUrl(path);
  }
}
