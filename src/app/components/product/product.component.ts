import { Component, signal, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray, FormControl } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { AttributeService } from '../../services/attribute.service';
import { Product, ProductDTO, ProductAttributeValueDTO } from '../../models/product.model';
import { Category } from '../../models/category.model';
import { CategoryAttribute, AttributeType } from '../../models/attribute.model';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    SelectModule,
    CheckboxModule,
    ButtonModule,
    InputNumberModule,
    MultiSelectModule
  ],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductFormComponent implements OnInit {
  productForm!: FormGroup;
  categories = signal<Category[]>([]);
  categoryAttributes = signal<CategoryAttribute[]>([]);
  attributeTypes = signal(Object.values(AttributeType));

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private attributeService: AttributeService
  ) {}

  ngOnInit() {
    this.productForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      categoryId: [null, Validators.required],
      attributeValues: this.fb.array([])
    });

    // this.categoryService.getCategories().subscribe(cats => this.categories.set(cats));

    this.productForm.get('categoryId')?.valueChanges.subscribe(categoryId => {
      if (categoryId) {
        this.attributeService.getCategoryAttributes(categoryId).subscribe(attrs => {
          this.categoryAttributes.set(attrs);
          this.updateAttributeValuesFormArray(attrs);
        });
      } else {
        this.categoryAttributes.set([]);
        this.attributeValuesFormArray.clear();
      }
    });
  }

  get attributeValuesFormArray() {
    return this.productForm.get('attributeValues') as FormArray;
  }

  updateAttributeValuesFormArray(attributes: CategoryAttribute[]) {
    this.attributeValuesFormArray.clear();
    attributes.forEach(attr => {
      const validator = attr.required ? Validators.required : null;
      this.attributeValuesFormArray.push(
        this.fb.group({
          attributeId: [attr.attributeId],
          value: new FormControl(attr.attributeType === AttributeType.BOOLEAN ? false : attr.attributeType === AttributeType.MULTISELECT ? [] : '', validator)
        })
      );
    });
  }

  getValueControl(index: number): FormControl {
    const control = this.attributeValuesFormArray.at(index).get('value');
    if (!control) {
      throw new Error(`FormControl at index ${index} is null`);
    }
    return control as FormControl;
  }

  onSubmit() {
    if (this.productForm.valid) {
      const productDTO: ProductDTO = {
        title: this.productForm.get('title')?.value,
        description: this.productForm.get('description')?.value,
        price: Number(this.productForm.get('price')?.value.toFixed(2)),
        stock: this.productForm.get('stock')?.value,
        categoryId: this.productForm.get('categoryId')?.value,
        attributeValues: this.attributeValuesFormArray.value.map((val: any) => ({
          attributeId: val.attributeId,
          value: Array.isArray(val.value) ? val.value.join(',') : val.value.toString()
        }))
      };
      this.productService.addProduct(productDTO).subscribe(() => {
        this.productForm.reset();
        this.categoryAttributes.set([]);
        this.attributeValuesFormArray.clear();
      });
    }
  }
}