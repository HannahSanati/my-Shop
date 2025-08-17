import { AttributeType } from './attribute.model';

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  stock: number;
  categoryId: number;
  categoryName?: string;
  attributeValues: ProductAttributeValue[];
  productDiscountedPrice?: number; 
  productImages: { url: string }[]; 
}


export interface ProductDTO {
  title: string;
  description: string;
  price: number;
  stock: number;
  categoryId: number;
  attributeValues: ProductAttributeValueDTO[];
}
export interface ProductAttributeValue {
  id: number;
  attributeId: number;
  attributeName: string;
  attributeType: AttributeType;
  value: string;
}
export interface ProductAttributeValueDTO {
  attributeId: number;
  value: string;
}
export interface CategoryAttribute {
  attributeId: number;
  attributeName: string;
  attributeType: AttributeType;
  required: boolean;
}