import { Component, inject, signal } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { CategoryTreeNodeDTO } from '../../models/category.model';
import { TreeNode } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { TreeModule } from 'primeng/tree';

@Component({
  selector: 'app-tree-view',
  imports: [CommonModule, TreeModule],
  templateUrl: './tree-view.component.html',
  styleUrl: './tree-view.component.css'
})

export class TreeViewComponent {
  categories = signal<TreeNode[]>([]);
  private categoryService = inject(CategoryService);

  constructor() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (cats) => {
        this.categories.set(this.mapCategoriesToTreeNodes(cats));
      },
      error: (err) => {
        console.error('خطا در لود دسته‌بندی‌ها:', err);
      }
    });
  }

  mapCategoriesToTreeNodes(categories: CategoryTreeNodeDTO[]): TreeNode[] {
    return categories.map(category => ({
      key: category.key,
      label: category.label || 'بدون نام',
      data: { id: category.data.id, description: category.data.description || '' },
      children: category.children ? this.mapCategoriesToTreeNodes(category.children) : []
    }));
  }
}
