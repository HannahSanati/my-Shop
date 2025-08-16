// import { Component, Output, EventEmitter, signal, inject } from '@angular/core';
// import { CategoryService } from '../../services/category.service';
// import { CategoryTreeNodeDTO } from '../../models/category.model';
// import { TreeNode } from 'primeng/api';
// import { CommonModule } from '@angular/common';
// import { TreeModule } from 'primeng/tree';
// import { ButtonModule } from 'primeng/button';

// @Component({
//   selector: 'app-category-tree',
//   standalone: true,
//   imports: [CommonModule, TreeModule, ButtonModule],
//   templateUrl: './category-tree.component.html',
//   styleUrls: ['./category-tree.component.css']
// })
// export class CategoryTreeComponent {
//   categories = signal<TreeNode[]>([]);
//   @Output() nodeSelected = new EventEmitter<number | null>();
//   private categoryService = inject(CategoryService);

//   constructor() {
//     this.loadCategories();
//   }

//   loadCategories() {
//     this.categoryService.getCategories().subscribe({
//       next: (cats) => {
//         console.log('دسته‌بندی‌های دریافتی:', JSON.stringify(cats, null, 2)); // لاگ برای دیباگ
//         this.categories.set(this.mapCategoriesToTreeNodes(cats));
//       },
//       error: (err) => {
//         console.error('خطا در لود دسته‌بندی‌ها:', err);
//         alert('خطایی در لود دسته‌بندی‌ها رخ داد.');
//       }
//     });
//   }

//   mapCategoriesToTreeNodes(categories: CategoryTreeNodeDTO[]): TreeNode[] {
//     return categories
//       .filter(category => category && category.data && category.data.id != null) // فیلتر دسته‌های معتبر
//       .map(category => ({
//         key: category.key, // استفاده از key که از سرور میاد
//         label: category.label || 'بدون نام',
//         data: {
//           id: category.data.id,
//           description: category.data.description || ''
//         },
//         children: category.children ? this.mapCategoriesToTreeNodes(category.children) : []
//       }));
//   }

//   selectNode(event: any) {
//     if (event.node && event.node.data && event.node.data.id) {
//       this.nodeSelected.emit(Number(event.node.data.id));
//     }else{
//       this.nodeSelected.emit(null);
//     }
//   }

// deleteCategory(id: number) {
//     this.categoryService.deleteCategory(id).subscribe({
//         next: () => {
//             console.log('دسته‌بندی حذف شد');
//             this.loadCategories();
//             this.nodeSelected.emit(null);
//             // به‌روزرسانی UI
//         },
//         error: (err) => {
//             console.error('خطا در حذف دسته‌بندی:', err);
//             let errorMessage = 'خطایی در حذف دسته‌بندی رخ داد.';
//             if (err.status === 400) {
//                 errorMessage = err.error || 'دسته‌بندی به دلیل وجود زیرمجموعه‌ها قابل حذف نیست.';
//             } else if (err.status === 404) {
//                 errorMessage = 'دسته‌بندی یافت نشد.';
//             }
//             alert(errorMessage);
//         }
//     });
// }
// }


import { Component, Output, EventEmitter, signal, inject } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { CategoryTreeNodeDTO } from '../../models/category.model';
import { TreeNode } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { TreeModule } from 'primeng/tree';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-category-tree',
  standalone: true,
  imports: [CommonModule, TreeModule, ButtonModule],
  templateUrl: './category-tree.component.html',
  styleUrls: ['./category-tree.component.css']
})
export class CategoryTreeComponent {
  categories = signal<TreeNode[]>([]);
  @Output() nodeSelected = new EventEmitter<number | null>();
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
        alert('خطایی در لود دسته‌بندی‌ها رخ داد.');
      }
    });
  }

  mapCategoriesToTreeNodes(categories: CategoryTreeNodeDTO[]): TreeNode[] {
    return categories
      .filter(category => category && category.data && category.data.id != null)
      .map(category => ({
        key: String(category.data.id),
        label: category.label || 'بدون نام',
        data: {
          id: category.data.id,
          description: category.data.description || ''
        },
        children: category.children ? this.mapCategoriesToTreeNodes(category.children) : []
      }));
  }

  selectNode(event: any) {
    const id = event.node?.data?.id ?? null;
    this.nodeSelected.emit(id);
  }

  deleteCategory(id: number) {
    if (!confirm('آیا از حذف این دسته‌بندی مطمئن هستید؟')) return;
    this.categoryService.deleteCategory(id).subscribe({
      next: () => {
        this.loadCategories();
        this.nodeSelected.emit(null);
      },
      error: (err) => {
        console.error('خطا در حذف دسته‌بندی:', err);
        let errorMessage = 'خطایی در حذف دسته‌بندی رخ داد.';
        if (err.status === 400) {
          errorMessage = err.error || 'دسته‌بندی به دلیل وجود زیرمجموعه‌ها قابل حذف نیست.';
        } else if (err.status === 404) {
          errorMessage = 'دسته‌بندی یافت نشد.';
        }
        alert(errorMessage);
      }
    });
  }
}
