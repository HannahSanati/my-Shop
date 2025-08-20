import { Component, inject, OnInit, signal } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { ProductDTO } from '../../../models/product.model';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [TableModule, ButtonModule, TagModule, CommonModule],
  templateUrl: './product-list.component.html',
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);

  // Products signal
  products = signal<ProductDTO[]>([]);

  // Expanded row
  expanded = signal<number | null>(null);

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (data) => this.products.set(data),
      error: (err) => console.error(err)
    });
  }

  deleteProduct(id: number) {
    this.productService.deleteProduct(id).subscribe({
      next: () => this.products.update(list => list.filter(p => p.id !== id)),
      error: (err) => console.error(err)
    });
  }

  toggleExpanded(id: number) {
    this.expanded.set(this.expanded() === id ? null : id);
  }

  editProduct(product: ProductDTO) {
    // this.productForm.patchValue({
    //   title: product.title,
    //   description: product.description,
    //   price: product.price,
    //   stock: product.stock,
    //   condition: product.condition,
    //   categoryId: product.categoryId
    // });
}
}