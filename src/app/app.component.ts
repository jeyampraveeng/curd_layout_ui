import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    SidebarComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'FRAMEWORK UI APP'; 
  sidebarOpen = false;
  isLoggedIn = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Check if user is logged in (token exists)
    this.isLoggedIn = !!localStorage.getItem('token');
    
    // Subscribe to auth state changes
    this.authService.authStateChanged.subscribe(
      (loggedIn: boolean) => {
        this.isLoggedIn = loggedIn;
      }
    );

  }
  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  onSidebarToggle(isOpen: boolean) {
    this.sidebarOpen = isOpen;
  }
}