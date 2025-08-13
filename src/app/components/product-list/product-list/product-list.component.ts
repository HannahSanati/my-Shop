import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product.model';

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
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  listings: Product[] = [];
  idx: number | undefined;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.listings = products;
        console.log('Products loaded:', products);
      },
      error: (err) => {
        console.error('Error loading products:', err);
      }
    });
  }

  deleteProduct(productId: number, index: number) {
    this.productService.deleteProduct(productId).subscribe({
      next: () => {
        this.listings.splice(index, 1);
        console.log('Product deleted:', productId);
      },
      error: (err) => {
        console.error('Failed to delete product:', err);
      }
    });
  }
}
