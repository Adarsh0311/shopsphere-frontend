import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment';
import { RouterModule } from '@angular/router';
import { LoginComponent } from "./features/auth/login/login.component";
import { NavbarComponent } from './navbar/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = environment.appName;

    constructor() {
    if (environment.enableLogging) {
      console.log('App started in development mode');
      console.log('API URL:', environment.apiUrl);
      console.log('Version:', environment.version);
    }
  }

}
