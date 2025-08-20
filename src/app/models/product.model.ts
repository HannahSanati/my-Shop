import { AttributeType } from './attribute.model';
import { ProductCondition } from './category.model';


export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  stock: number;
  categoryId: number;
  categoryName?: string;
  attributeValues: ProductAttributeValue[];
}

export interface ProductDTO {
  id: number;
  title: string;
  description: string;
  price: number;
  stock: number;
  categoryId: number;
  condition?: ProductCondition;
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
