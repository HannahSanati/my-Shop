import { Component, signal, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';

import { CategoryTreeComponent } from "../category-tree/category-tree.component";
import { CategoryFormComponent } from "../category-form/category-form.component";

@Component({
  selector: 'app-category-management',
  standalone: true,
  imports: [CategoryTreeComponent, CategoryFormComponent],
  templateUrl: './category-management.component.html',
  styleUrls: ['./category-management.component.css']
})
export class CategoryManagementComponent {
  selectedCategoryId = signal<number | null>(null);
  @ViewChild(CategoryTreeComponent) categoryTree!: CategoryTreeComponent;

  onCategorySelected(id: number | null) {
    this.selectedCategoryId.set(id);
  }

  onCategoryUpdated() {
    this.selectedCategoryId.set(null);
    this.categoryTree.loadCategories();
  }
}