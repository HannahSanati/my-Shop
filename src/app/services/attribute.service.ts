import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { BaseService } from './base.service';
import { Attribute, CategoryAttributeDTO, AttributeType } from '../models/attribute.model';

@Injectable({
  providedIn: 'root'
})
export class AttributeService extends BaseService {
  private readonly attributesEndpoint = 'attributes';
  private readonly categoryAttributesEndpoint = 'category-attributes';
  private attributeCache = new Map<number, CategoryAttributeDTO[]>();

  getAttributes(): Observable<Attribute[]> {
    return this.get<Attribute[]>(this.attributesEndpoint).pipe(
      catchError(this.handleError)
    );
  }

  addAttribute(attribute: Attribute): Observable<Attribute> {
    return this.post<Attribute>(this.attributesEndpoint, attribute).pipe(
      catchError(this.handleError)
    );
  }

  getCategoryAttributes(categoryId: number, forceRefresh = false): Observable<CategoryAttributeDTO[]> {
    if (forceRefresh || !this.attributeCache.has(categoryId)) {
      return this.get<CategoryAttributeDTO[]>(`${this.categoryAttributesEndpoint}/category/${categoryId}`).pipe(
        tap(attributes => this.attributeCache.set(categoryId, attributes)),
        catchError(this.handleError)
      );
    }
    return of(this.attributeCache.get(categoryId)!);
  }

  addCategoryAttribute(categoryAttribute: CategoryAttributeDTO): Observable<CategoryAttributeDTO> {
    return this.post<CategoryAttributeDTO>(this.categoryAttributesEndpoint, categoryAttribute).pipe(
      tap(() => this.attributeCache.clear()),
      catchError(this.handleError)
    );
  }

  deleteCategoryAttribute(id: number): Observable<void> {
    return this.delete<void>(`${this.categoryAttributesEndpoint}/${id}`).pipe(
      tap(() => this.attributeCache.clear()),
      catchError(this.handleError)
    );
  }
}