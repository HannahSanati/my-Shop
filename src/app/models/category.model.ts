import { CategoryAttributeDTO } from './attribute.model';

export enum ProductCondition {
  NEW = 'new',
  USED = 'used',
}

export const ProductConditionTranslate = {
  [ProductCondition.NEW] : 'نو',
  [ProductCondition.USED]: 'دست دوم'
} as const 

export interface Category {
  id: number;
  name: string;
  description?: string;
  parentId?: number | null;
  children?: Category[];
}

export interface CategoryDTO {
  name: string;
  description?: string;
  parentId?: number | null;
  condition?: ProductCondition;
}


export interface CategoryTreeNodeDTO {
  key: string;
  label: string;
  data: { id: number; description: string; parentId: number | null };
  children?: CategoryTreeNodeDTO[];
  attributes?: CategoryAttributeDTO[];
}

