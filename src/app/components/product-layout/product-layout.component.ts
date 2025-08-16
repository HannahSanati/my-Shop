import { Component } from '@angular/core';
import { ProductFormComponent } from "../product/product.component";
import { ProductListComponent } from "../product-list/product-list/product-list.component";
import { CategoryTreeComponent } from "../category-tree/category-tree.component";
import { TreeViewComponent } from "../tree-view/tree-view.component";

@Component({
  selector: 'app-product-layout',
  imports: [ProductFormComponent, ProductListComponent, CategoryTreeComponent, TreeViewComponent],
  templateUrl: './product-layout.component.html',
  styleUrl: './product-layout.component.css'
})
export class ProductLayoutComponent  {
  selectedCategoryId: number | null = null;

  handleCategorySelected(id: number | null) {
    if (id !== null) {
      this.selectedCategoryId = id;
    }
  }

  onProductAdded() {
  }
}