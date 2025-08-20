import { Component, EventEmitter, Output, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeModule } from 'primeng/tree';
import { TreeNode } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import { take, debounceTime } from 'rxjs';
import { switchMap, expand, reduce, of } from 'rxjs';

import { CategoryService } from '../../../services/category.service';
import { AttributeService } from '../../../services/attribute.service';
import { CategoryTreeNodeDTO } from '../../../models/category.model';
import { CategoryAttributeDTO } from '../../../models/attribute.model';

@Component({
  selector: 'app-category-tree',
  standalone: true,
  imports: [CommonModule, TreeModule, ButtonModule, DialogModule],
  templateUrl: './category-tree.component.html',
  styleUrls: ['./category-tree.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush // بهینه‌سازی رندر
})
export class CategoryTreeComponent {
 categories = signal<TreeNode[]>([]);
@Output() nodeSelected = new EventEmitter<number | null>();
showDialog = signal(false);
selectedNode = signal<TreeNode | null>(null);
private categoryService = inject(CategoryService);
private attributeService = inject(AttributeService);
private messageService = inject(MessageService);
private isLoadingAttributes = false;

constructor() {
  this.loadCategories();
}

loadCategories() {
  this.categoryService.getCategories().pipe(take(1)).subscribe({
    next: (cats) => {
      this.categories.set(this.mapCategoriesToTreeNodes(cats));
    },
    error: () => {
      // Handled by BaseService
    }
  });
}

mapCategoriesToTreeNodes(categories: CategoryTreeNodeDTO[]): TreeNode[] {
  return categories
    .filter(category => category && category.data && category.data.id != null)
    .map(category => ({
      key: category.key,
      label: category.label || 'بدون نام',
      data: {
        id: category.data.id,
        description: category.data.description || '',
        attributes: [] as CategoryAttributeDTO[]
      },
      children: category.children ? this.mapCategoriesToTreeNodes(category.children) : [],
      expanded: false
    }));
}

selectNode(event: any) {
  if (event.node && event.node.data && event.node.data.id) {
    this.nodeSelected.emit(Number(event.node.data.id));
  } else {
    this.nodeSelected.emit(null);
  }
}

toggleNode(node: TreeNode) {
  node.expanded = !node.expanded;
  if (node.expanded && !node.children?.length) {
    this.loadNode({ node });
  }
}

loadAllInheritedAttributes(categoryId: number, collected: CategoryAttributeDTO[] = []): Promise<CategoryAttributeDTO[]> {
  return new Promise((resolve, reject) => {
    this.categoryService.getCategory(categoryId).pipe(take(1)).subscribe({
      next: (category) => {
        this.attributeService.getCategoryAttributes(categoryId, false).pipe(take(1)).subscribe({
          next: (attrs) => {
            const merged = [
              ...collected,
              ...attrs.map(attr => ({
                ...attr,
                inherited: collected.length > 0
              }))
            ];
            if (category.parentId) {
              this.loadAllInheritedAttributes(category.parentId, merged).then(resolve).catch(reject);
            } else {
              resolve(merged);
            }
          },
          error: reject
        });
      },
      error: reject
    });
  });
}

showAttributesDialog(node: TreeNode) {
  if (this.isLoadingAttributes || this.showDialog()) return;
  if (!node.data?.id) return;

  this.isLoadingAttributes = true;
  this.selectedNode.set(node);

  this.loadAllInheritedAttributes(node.data.id)
    .then(attributes => {
      node.data.attributes = attributes;
      this.showDialog.set(true);
      this.isLoadingAttributes = false;
    })
    .catch(() => {
      this.isLoadingAttributes = false;
    });
}

onDialogShow() {
  console.log('دیالوگ ویژگی‌ها باز شد');
}

onDialogHide() {
  this.showDialog.set(false);
  this.isLoadingAttributes = false;
}

deleteCategory(id: number) {
  this.categoryService.deleteCategory(id).pipe(take(1)).subscribe({
    next: () => {
      this.loadCategories();
      this.nodeSelected.emit(null);
      this.messageService.add({ severity: 'success', summary: 'موفق', detail: 'دسته‌بندی با موفقیت حذف شد', life: 3000 });
    },
    error: () => {
      // Handled by BaseService
    }
  });
}

loadNode(event: any) {
  if (event.node && !event.node.children?.length) {
    this.categoryService.getCategoryChildren(event.node.data.id).pipe(take(1)).subscribe({
      next: (children) => {
        event.node.children = this.mapCategoriesToTreeNodes(children);
      },
      error: () => {
        // Handled by BaseService
      }
    });
  }
}

trackByAttribute(index: number, attr: CategoryAttributeDTO): number {
  return attr.id;
}
}