import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CategoryFormComponent } from "../category-form/category-form.component";
import { CategoryTreeComponent } from "../category-tree/category-tree.component";
import { FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-layout',
  imports: [CategoryFormComponent, CategoryTreeComponent, CommonModule],
  templateUrl: './category-layout.component.html',
  styleUrl: './category-layout.component.css'
})
export class CategoryLayoutComponent {
  selectedCategoryId: number | null = null; // <-- can be null initially

  onCategorySelected(categoryId: number) {
    this.selectedCategoryId = categoryId;
  }
  onCategoryUpdated() {
    // optional: refresh tree or perform other actions
    console.log('Category updated!');
  }
}