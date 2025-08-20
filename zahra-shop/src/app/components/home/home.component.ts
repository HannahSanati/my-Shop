import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  
import { Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';

import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-home',
  imports: [CommonModule, InputTextModule, ButtonModule, CardModule],  
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],  
})
export class HomeComponent implements OnInit{
  productDetails: Product[] = [];
  allProducts: Product[] = [];
  searchKeyword: string = '';
  showLoadButton: boolean = true;
  page: number = 1;

  constructor(private productService: ProductService,
    private router: Router
  ) {}
  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  // Method to fetch products
  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.productDetails = data;
        this.allProducts = data;
      },
      error: (error) => {
        console.error('Error loading products', error);
      },
    });
  }

  // Method to filter products based on the search keyword
  searchByKeyword(keyword: string) {
    this.searchKeyword = keyword;

    if (this.searchKeyword.trim()) {
      this.productDetails = this.allProducts.filter((product) =>
        product.title.toLowerCase().includes(this.searchKeyword.toLowerCase())
      );
    } else {
      this.productDetails = [...this.allProducts];
    }
  }

  // Handle showing the product details
  showProductDetails(productId: number) {
    console.log('Product ID:', productId);
  }

  // Load more products when button is clicked
  loadMoreProduct() {
    console.log('Load more products...');
    this.page += 1;
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.productDetails = [...this.productDetails, ...data];
      },
      error: (error) => {
        console.error('Error loading more products', error);
      },
    });
  }
}