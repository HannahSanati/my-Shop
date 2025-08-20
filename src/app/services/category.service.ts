import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BaseService } from './base.service';

import { Category, CategoryDTO, CategoryTreeNodeDTO } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends BaseService {
  private readonly categoriesEndpoint = 'categories';
  private readonly treeEndpoint = 'categories/tree';

  /**
   * گرفتن درخت دسته‌بندی‌ها
   */
  getCategories(): Observable<CategoryTreeNodeDTO[]> {
    return this.get<CategoryTreeNodeDTO[]>(this.treeEndpoint).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * گرفتن یک دسته‌بندی خاص
   */
  getCategory(id: number): Observable<Category> {
    return this.get<Category>(`${this.categoriesEndpoint}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * اضافه کردن دسته‌بندی جدید
   */
  addCategory(category: CategoryDTO): Observable<Category> {
    return this.post<Category>(this.categoriesEndpoint, category).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * بروزرسانی دسته‌بندی
   */
  updateCategory(id: number, category: CategoryDTO): Observable<Category> {
    return this.put<Category>(`${this.categoriesEndpoint}/${id}`, category).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * حذف دسته‌بندی
   */
  deleteCategory(id: number): Observable<void> {
    return this.delete<void>(`${this.categoriesEndpoint}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**شتیبانی از لود تدریجی p-tree */
  getCategoryChildren(parentId: number): Observable<CategoryTreeNodeDTO[]> {
    return this.get<CategoryTreeNodeDTO[]>(`${this.categoriesEndpoint}/${parentId}/children`).pipe(
      catchError(this.handleError)
    );
  }
}