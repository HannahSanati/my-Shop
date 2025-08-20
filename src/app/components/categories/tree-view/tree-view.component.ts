import { Component, inject, signal } from '@angular/core';
import { CategoryService } from '../../../services/category.service';
import { AttributeService } from '../../../services/attribute.service';
import { TreeNode } from 'primeng/api';
import { CategoryTreeNodeDTO } from '../../../models/category.model';
import { CategoryAttributeDTO } from '../../../models/attribute.model';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table'; // اگر جدول می‌خواهید
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TreeModule } from 'primeng/tree';

@Component({
  selector: 'app-tree-view',
  standalone: true,
  imports: [CommonModule, TreeModule, ButtonModule, DialogModule, ButtonModule, TableModule,],
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.css'],
  providers: [MessageService]
})
export class TreeViewComponent {
  categories = signal<TreeNode[]>([]);
  selectedNode = signal<TreeNode | null>(null);
  showDialog = signal(false);
  private categoryService = inject(CategoryService);
  private attributeService = inject(AttributeService);
  private messageService = inject(MessageService);
  private isLoadingAttributes = false;

  constructor() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (cats) => {
        this.categories.set(this.mapCategoriesToTreeNodes(cats));
        this.messageService.clear();
        this.messageService.add({ severity: 'success', summary: 'موفق', detail: 'دسته‌بندی‌ها با موفقیت لود شدند', life: 3000 });
      },
      error: (err) => {
        console.error('خطا در لود دسته‌بندی‌ها:', err);
        this.messageService.clear();
        this.messageService.add({ severity: 'error', summary: 'خطا', detail: 'لود دسته‌بندی‌ها انجام نشد', life: 3000 });
      }
    });
  }

  mapCategoriesToTreeNodes(categories: CategoryTreeNodeDTO[]): TreeNode[] {
    return categories.map(cat => ({
      key: cat.key,
      label: cat.label || 'بدون نام',
      data: { id: cat.data.id, description: cat.data.description || '', attributes: [] as CategoryAttributeDTO[] },
      children: cat.children ? this.mapCategoriesToTreeNodes(cat.children) : [],
      expanded: false
    }));
  }

  toggleNode(node: TreeNode) {
    node.expanded = !node.expanded;
    if (node.expanded && !node.children?.length) {
      this.loadNode({ node });
    }
  }

  loadNode(event: any) {
    if (event.node && !event.node.children?.length) {
      this.categoryService.getCategoryChildren(event.node.data.id).subscribe({
        next: children => {
          event.node.children = this.mapCategoriesToTreeNodes(children);
          this.messageService.add({ severity: 'success', summary: 'موفق', detail: 'زیرمجموعه‌ها با موفقیت لود شدند', life: 3000 });
        },
        error: (err) => {
          console.error('خطا در لود زیرمجموعه:', err);
          this.messageService.add({ severity: 'error', summary: 'خطا', detail: 'لود زیرمجموعه انجام نشد', life: 3000 });
        }
      });
    }
  }

  private loadAllInheritedAttributes(categoryId: number, collected: CategoryAttributeDTO[] = []): Promise<CategoryAttributeDTO[]> {
    return new Promise((resolve, reject) => {
      this.categoryService.getCategory(categoryId).subscribe({
        next: category => {
          this.attributeService.getCategoryAttributes(categoryId, false).subscribe({
            next: attrs => {
              const merged = [...collected, ...attrs.map(a => ({ ...a, inherited: collected.length > 0 }))];
              if (category.parentId) this.loadAllInheritedAttributes(category.parentId, merged).then(resolve).catch(reject);
              else resolve(merged);
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
      .then(attrs => {
        node.data.attributes = attrs;
        this.showDialog.set(true);
        this.isLoadingAttributes = false;
        this.messageService.clear();
        this.messageService.add({
          severity: 'success',
          summary: 'موفق',
          detail: 'ویژگی‌ها با موفقیت لود شدند',
          life: 3000
        });
      })
      .catch(() => {
        this.isLoadingAttributes = false;
        this.messageService.clear();
        this.messageService.add({
          severity: 'error',
          summary: 'خطا',
          detail: 'لود ویژگی‌ها انجام نشد',
          life: 3000
        });
      });
  }

  trackByAttribute(index: number, attr: CategoryAttributeDTO) {
    return attr.id;
  }
}