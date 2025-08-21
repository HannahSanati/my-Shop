import { Component, inject, OnInit, signal } from '@angular/core';
import { ProductService } from '../../../../services/product.service';
import { ProductDTO } from '../../../../models/product.model';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';
import { ProductConditionTranslate } from '../../../../models/category.model';

export const mockProducts: any[] = [
  {
    id: 76,
    title: "آیفون 13",
    description: "",
    price: 12000000,
    stock: 1,
    categoryId: 82,
    categoryName: "ios",
    attributeValues: [
      {
        id: 34,
        attributeId: 132,
        attributeName: "رنگ",
        attributeType: "STRING",
        value: "سفید",
        productId: null,
      },
    ],
  },
  {
    id: 77,
    title: "asus1",
    description: "",
    price: 0,
    stock: 0,
    categoryId: 84,
    categoryName: "asus",
    attributeValues: [],
  },
  {
    id: 78,
    title: "ss",
    description: "",
    price: 0,
    stock: 0,
    categoryId: 85,
    categoryName: "test",
    attributeValues: [],
  },
  {
    id: 79,
    title: "a",
    description: "",
    price: 0,
    stock: 0,
    categoryId: 87,
    categoryName: "test select",
    attributeValues: [
      {
        id: 35,
        attributeId: 138,
        attributeName: "a",
        attributeType: "SELECT",
        value: "1",
        productId: null,
      },
    ],
  },
  {
    id: 80,
    title: "a",
    description: "",
    price: 0,
    stock: 0,
    categoryId: 87,
    condition: 'new',
    categoryName: "test select",
    attributeValues: [
      {
        id: 36,
        attributeId: 138,
        attributeName: "a",
        attributeType: "SELECT",
        value: "1",
        productId: null,
      },
    ],
  },
  {
    id: 81,
    title: "iphon 13",
    description: "",
    price: 1223,
    stock: 0,
    categoryId: 82,
    condition: 'used',
    categoryName: "ios",
    attributeValues: [
      {
        id: 37,
        attributeId: 132,
        attributeName: "رنگ",
        attributeType: "STRING",
        value: "سفید",
        productId: null,
      },
    ],
  },
];

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [TableModule, ButtonModule, TagModule, CommonModule],
  templateUrl: './product-list.component.html',
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  public readonly condiationTranslator = ProductConditionTranslate

  // Products signal
  products = signal<ProductDTO[]>([]);

  // Expanded row
  expanded = signal<number | null>(null);

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.products.set(mockProducts)
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