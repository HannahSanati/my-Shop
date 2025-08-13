import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Attribute, CategoryAttribute, CategoryAttributeDTO, AttributeType } from '../models/attribute.model';

@Injectable({
  providedIn: 'root'
})
export class AttributeService {
  private apiUrl = 'http://192.168.113.143:8080/api/attributes';
  private categoryAttributeApiUrl = 'http://192.168.113.143:8080/api/category-attributes';
  private http = inject(HttpClient);

  getAttributes(): Observable<Attribute[]> {
    return this.http.get<Attribute[]>(this.apiUrl);
  }

  getAttribute(id: number): Observable<Attribute> {
    return this.http.get<Attribute>(`${this.apiUrl}/${id}`);
  }

  addAttribute(attribute: Attribute): Observable<Attribute> {
    return this.http.post<Attribute>(this.apiUrl, attribute);
  }

  updateAttribute(id: number, attribute: Attribute): Observable<Attribute> {
    return this.http.put<Attribute>(`${this.apiUrl}/${id}`, attribute);
  }

  deleteAttribute(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  addCategoryAttribute(categoryAttribute: CategoryAttributeDTO): Observable<CategoryAttribute> {
    return this.http.post<CategoryAttribute>(this.categoryAttributeApiUrl, categoryAttribute);
  }

  getCategoryAttributes(categoryId: number): Observable<CategoryAttribute[]> {
    return this.http.get<CategoryAttribute[]>(`${this.categoryAttributeApiUrl}/category/${categoryId}`);
  }

  deleteCategoryAttribute(id: number): Observable<void> {
    return this.http.delete<void>(`${this.categoryAttributeApiUrl}/${id}`);
  }
}