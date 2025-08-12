import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

interface Listing {
  id: number;
  title: string;
  price: number;
  condition: 'new' | 'used';
  description?: string;
}

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, CardModule, ButtonModule, TagModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']})

export class ProductListComponent {
  listings: Listing[] = [
    { id: 1, title: 'آیفون ۱۵', price: 90000000, condition: 'new', description: 'جدید و آکبند' },
    { id: 2, title: 'موبایل سامسونگ', price: 75000000, condition: 'used', description: 'دست دوم و سالم' },
    { id: 3, title: 'آب معدنی', price: 15000, condition: 'new', description: 'بطری 1.5 لیتری' },
  ];
}