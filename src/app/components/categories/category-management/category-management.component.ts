import { Component, ViewChild, signal } from '@angular/core';
import { CategoryTreeComponent } from '../category-tree/category-tree.component';
import { CategoryFormComponent } from '../category-form/category-form.component';

@Component({
  selector: 'app-category-management',
  imports: [CategoryTreeComponent, CategoryFormComponent],
  templateUrl: './category-management.component.html',
  styleUrl: './category-management.component.css'
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