import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet,
    ButtonModule,
    CardModule,
    InputTextModule,
  ],
  template: `
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {
  title = 'store';
}