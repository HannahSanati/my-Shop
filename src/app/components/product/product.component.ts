import {
  Component,
  signal,
  OnInit,
  Input,
  SimpleChanges,
  OnChanges,
  EventEmitter,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormArray,
  FormControl,
} from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { AttributeService } from '../../services/attribute.service';
import { ProductDTO } from '../../models/product.model';
import { CategoryTreeNodeDTO } from '../../models/category.model';
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
    MultiSelectModule,
  ],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})


export class ProductFormComponent implements OnInit, OnChanges {
  productForm!: FormGroup;

  categories = signal<CategoryTreeNodeDTO[]>([]);
  mappedCategories = signal<{ id: number; name: string }[]>([]); // <-- Added

  categoryAttributes = signal<CategoryAttribute[]>([]);
  attributeTypes = signal(Object.values(AttributeType));

  @Input() categoryId!: number | null;

  @Output() productAdded = new EventEmitter<void>();

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
      attributeValues: this.fb.array([]),
    });

    this.categoryService.getCategories().subscribe((cats) => {
      this.categories.set(cats);
      this.mappedCategories.set(
        cats.map((cat) => ({ id: cat.data.id, name: cat.label }))
      );
    });

    this.productForm.get('categoryId')?.valueChanges.subscribe((categoryId) => {
      if (categoryId) {
        this.loadAttributes(categoryId);
      } else {
        this.categoryAttributes.set([]);
        this.attributeValuesFormArray.clear();
      }
    });

    if (this.categoryId) {
      this.productForm.patchValue({ categoryId: this.categoryId });
      this.loadAttributes(this.categoryId);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['categoryId'] && this.categoryId) {
      this.productForm.patchValue({ categoryId: this.categoryId });
      this.loadAttributes(this.categoryId);
    }
  }

  get attributeValuesFormArray(): FormArray {
    return this.productForm.get('attributeValues') as FormArray;
  }

  loadAttributes(categoryId: number) {
    this.attributeService.getCategoryAttributes(categoryId).subscribe({
      next: (attrs) => {
        console.log('Attributes loaded for category', categoryId, attrs);
        this.categoryAttributes.set(attrs);
        this.updateAttributeValuesFormArray(attrs);
      },
      error: (err) => {
        console.error('Error loading attributes:', err);
        this.categoryAttributes.set([]);
        this.attributeValuesFormArray.clear();
      },
    });
  }

  updateAttributeValuesFormArray(attributes: CategoryAttribute[]) {
    this.attributeValuesFormArray.clear();
    attributes.forEach((attr) => {
      const validator = attr.required ? [Validators.required] : [];
      this.attributeValuesFormArray.push(
        this.fb.group({
          attributeId: [attr.attributeId],
          value: new FormControl(
            attr.attributeType === AttributeType.BOOLEAN
              ? false
              : attr.attributeType === AttributeType.MULTISELECT
              ? []
              : '',
            validator
          ),
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
    if (!this.productForm.valid) {
      alert('لطفا فرم را کامل و صحیح پر کنید.');
      return;
    }
  
    const attributes = this.attributeValuesFormArray.value.map(
      (val: any, i: number) => {
        const type = this.categoryAttributes()[i].attributeType;
        let value = val.value;
  
        switch (type) {
          case AttributeType.NUMBER:
            value = Number(value);
            break;
          case AttributeType.BOOLEAN:
            value = Boolean(value);
            break;
          case AttributeType.MULTISELECT:
            value = Array.isArray(value) ? value.join(',') : '';
            break;
          default:
            value = value != null ? value.toString() : '';
        }
  
        return {
          attributeId: val.attributeId,
          value,
        };
      }
    );
  
    const productDTO: ProductDTO = {
      title: this.productForm.get('title')?.value,
      description: this.productForm.get('description')?.value,
      price: Number(this.productForm.get('price')?.value),
      stock: Number(this.productForm.get('stock')?.value),
      categoryId: this.productForm.get('categoryId')?.value,
      attributeValues: attributes,
    };
  
    console.log('JSON to send:', JSON.stringify(productDTO));
  
    this.productService.addProduct(productDTO).subscribe({
      next: () => {
        console.log('Product added successfully');
        this.productForm.reset();
        this.categoryAttributes.set([]);
        this.attributeValuesFormArray.clear();
        this.productAdded.emit();
      },
      error: (err) => {
        console.error('Error adding product:', err);
        alert('خطا در ثبت محصول. لطفا دوباره تلاش کنید.');
      },
    });
  }
  
}
      
/////////debuging🤓
    //   this.productService.addProduct(productDTO).subscribe(() => {
    //     this.productForm.reset();
    //     this.categoryAttributes.set([]);
    //     this.attributeValuesFormArray.clear();
    //     this.productAdded.emit();
    //   });


    // } else {
    //   alert('لطفا فرم را کامل و صحیح پر کنید.');
    // }