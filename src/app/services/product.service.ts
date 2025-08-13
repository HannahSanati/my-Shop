// product.service.ts (اصلاح‌شده برای اتصال به API)
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductDTO, ProductAttributeValue, ProductAttributeValueDTO } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://192.168.113.143:8080/api/products';
  private productAttributeApiUrl = 'http://192.168.113.143:8080/api/product-attributes';
  private http = inject(HttpClient);

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  addProduct(product: ProductDTO): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  addProductAttribute(productAttribute: ProductAttributeValueDTO): Observable<ProductAttributeValue> {
    return this.http.post<ProductAttributeValue>(this.productAttributeApiUrl, productAttribute);
  }

  getProductAttributes(productId: number): Observable<ProductAttributeValue[]> {
    return this.http.get<ProductAttributeValue[]>(`${this.productAttributeApiUrl}?productId=${productId}`);
  }
  deleteProduct(productId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${productId}`);
  }
  
}
