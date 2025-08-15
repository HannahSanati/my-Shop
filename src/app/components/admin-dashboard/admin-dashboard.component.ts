import { Component, signal, ViewChild } from '@angular/core';
import { CategoryTreeComponent } from '../category-tree/category-tree.component';
import { CategoryFormComponent } from '../category-form/category-form.component';
import { ProductFormComponent } from '../product/product.component';
import { ProductListComponent } from "../product-list/product-list/product-list.component";
import { CategoryLayoutComponent } from "../category-layout/category-layout.component";
import { ProductLayoutComponent } from "../product-layout/product-layout.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',

})
export class AdminDashboardComponent {

  constructor(private router: Router) {}

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
// export class AdminDashboardComponent {
//   selectedCategoryId = signal<number | null>(null);
//   @ViewChild(CategoryTreeComponent) categoryTree!: CategoryTreeComponent;

//     this.selectedCategoryId.set(id);
//     console.log('Selected category ID:', this.selectedCategoryId());
//   }

//   onCategoryUpdated() {
//     this.selectedCategoryId.set(null);
//     this.categoryTree.loadCategories();
//   }
// }

