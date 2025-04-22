import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatToolbar, MatToolbarModule } from '@angular/material/toolbar';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatSidenavContainer,
    MatSidenavContent,
    MatCardModule,
    MatButtonModule,
    MatToolbar,
    MatToolbarModule,
    MatIcon,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    NgIf,
    NgFor
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isHandset = false;
  
  // Mock dashboard data
  analytics = {
    totalUsers: 3254,
    activeUsers: 2841,
    dailyVisits: 872,
    conversionRate: '3.6%'
  };
  
  recentActivities = [
    { action: 'User signup', user: 'john.doe@example.com', time: '10 minutes ago' },
    { action: 'Password reset', user: 'sarah.smith@example.com', time: '35 minutes ago' },
    { action: 'Profile update', user: 'robert.johnson@example.com', time: '2 hours ago' },
    { action: 'Login', user: 'michael.brown@example.com', time: '4 hours ago' }
  ];

  constructor(
    private router: Router,
    private breakpointObserver: BreakpointObserver
  ) { }

  ngOnInit(): void {
    this.breakpointObserver.observe([Breakpoints.HandsetPortrait])
      .subscribe(result => {
        this.isHandset = result.matches;
        if (this.sidenav) {
          this.sidenav.mode = this.isHandset ? 'over' : 'side';
          this.sidenav.opened = !this.isHandset;
        }
      });
  }

  logout(): void {
    // Clear token and return to login
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}