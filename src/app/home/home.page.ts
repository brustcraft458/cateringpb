import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service'; 

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  constructor(
    private authService: AuthService
  ) { }

  async ngOnInit() {
    let user = await this.authService.getUser();
    console.log(user)
  }
}
