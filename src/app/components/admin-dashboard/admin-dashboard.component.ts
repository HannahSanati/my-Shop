import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Card, CardModule } from "primeng/card";
import { PanelModule } from 'primeng/panel';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CardModule, PanelModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',

})
export class AdminDashboardComponent {
  constructor(private router: Router) {}

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}