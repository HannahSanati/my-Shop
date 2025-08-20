import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { MessageService } from 'primeng/api';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product.model';
import { TreeSelectModule } from 'primeng/treeselect';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, TagModule, TreeSelectModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  listings = signal<Product[]>([]);
  private productService = inject(ProductService);
  private messageService = inject(MessageService);

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.listings.set(products);
        this.messageService.add({ severity: 'success', summary: 'موفق', detail: 'محصولات با موفقیت لود شدند', life: 3000 });
      },
      error: () => {
        // خطا توسط BaseService مدیریت می‌شود
      },
    });
  }

  deleteProduct(productId: number, index: number) {
    this.productService.deleteProduct(productId).subscribe({
      next: () => {
        this.listings.update((listings) => listings.filter((_, i) => i !== index));
        this.messageService.add({ severity: 'success', summary: 'موفق', detail: 'محصول با موفقیت حذف شد', life: 3000 });
      },
      error: () => {
        // خطا توسط BaseService مدیریت می‌شود
      },
    });
  }
}