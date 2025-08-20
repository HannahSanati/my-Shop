export enum AttributeType {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',
  SELECT = 'SELECT',
  MULTISELECT = 'MULTISELECT'
}

export interface Attribute {
  id: number;
  name: string;
  type: AttributeType;
}

export interface CategoryAttributeDTO {
  id: number;
  categoryId: number;
  attributeId: number;
  attributeName: string;
  attributeType: AttributeType;
  required: boolean;
  categoryName: string;
  inherited: boolean;
}