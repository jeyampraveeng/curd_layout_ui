import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatIconModule,
    RouterLink,
    RouterLinkActive,
    MatTooltipModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Input() isOpen = true;
  @Output() toggleSidebar = new EventEmitter<boolean>();

  constructor(private router: Router, private authService: AuthService) {}

  navItems = [
    { name: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { name: 'Analytics', icon: 'bar_chart', route: '/about' },
    { name: 'Projects', icon: 'folder', route: '/projects' },
    { name: 'Calendar', icon: 'calendar_today', route: '/calendar' },
    { name: 'Tasks', icon: 'check_circle', route: '/tasks' },
    { name: 'Settings', icon: 'settings', route: '/settings' },
    
  ];

  toggleSidebarState(): void {
    this.isOpen = !this.isOpen;
    this.toggleSidebar.emit(this.isOpen);
  }


  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}