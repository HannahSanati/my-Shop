import { Component, signal, input, output, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { MultiSelectModule } from 'primeng/multiselect';
import { TreeSelectModule } from 'primeng/treeselect';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ChipsModule } from 'primeng/chips';
import { MessageService } from 'primeng/api';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { AttributeService } from '../../../services/attribute.service';
import { ProductDTO } from '../../../models/product.model';
import { CategoryTreeNodeDTO } from '../../../models/category.model';
import { CategoryAttributeDTO, AttributeType } from '../../../models/attribute.model';

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
    TreeSelectModule,
    AutoCompleteModule,
    ChipsModule,
],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css'],
})
export class ProductFormComponent implements OnInit, OnChanges {
  productForm!: FormGroup;
  categories = signal<any[]>([]);
  categoryAttributes = signal<CategoryAttributeDTO[]>([]);
  selectOptions = signal<{ [key: number]: any[] }>({});
  attributeTypes = signal(Object.values(AttributeType));
  categoryId = input<number | null>(null);
  productAdded = output<void>();
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private attributeService = inject(AttributeService);
  private messageService = inject(MessageService);

  ngOnInit() {
    this.productForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      categoryId: [null, Validators.required],
      attributeValues: this.fb.array([]),
    });

    this.categoryService.getCategories().subscribe({
      next: (cats) => {
        this.categories.set(this.mapToTreeNodes(cats));
        this.messageService.add({ severity: 'success', summary: 'موفق', detail: 'دسته‌بندی‌ها با موفقیت لود شدند', life: 3000 });
      },
      error: () => {
        // خطا توسط BaseService مدیریت می‌شود
      },
    });

    this.productForm.get('categoryId')?.valueChanges.subscribe((categoryId) => {
      if (categoryId) {
        this.loadAttributes(categoryId);
      } else {
        this.categoryAttributes.set([]);
        this.attributeValuesFormArray.clear();
      }
    });

    if (this.categoryId()) {
      this.productForm.patchValue({ categoryId: this.categoryId() });
      this.loadAttributes(this.categoryId()!);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['categoryId'] && this.categoryId()) {
      this.productForm.patchValue({ categoryId: this.categoryId() });
      this.loadAttributes(this.categoryId()!);
    }
  }

  mapToTreeNodes(categories: CategoryTreeNodeDTO[]): any[] {
    return categories
      .filter((cat) => cat && cat.data && cat.data.id != null)
      .map((cat) => ({
        key: cat.key,
        label: cat.label || 'بدون نام',
        data: { id: cat.data.id },
        children: cat.children ? this.mapToTreeNodes(cat.children) : [],
      }));
  }

  onCategorySelect(event: any) {
    const categoryId = event.node?.data?.id;
    if (categoryId) {
      this.productForm.patchValue({ categoryId });
      this.loadAttributes(categoryId);
    } else {
      this.messageService.add({ severity: 'warn', summary: 'هشدار', detail: 'دسته‌بندی نامعتبر انتخاب شد', life: 3000 });
    }
  }

  get attributeValuesFormArray(): FormArray {
    return this.productForm.get('attributeValues') as FormArray;
  }

  loadAttributes(categoryId: number) {
    this.attributeService.getCategoryAttributes(categoryId).subscribe({
      next: (attrs) => {
        this.categoryAttributes.set(attrs);
        this.updateAttributeValuesFormArray(attrs);
        attrs.forEach((attr) => {
          if (attr.attributeType === AttributeType.SELECT || attr.attributeType === AttributeType.MULTISELECT) {
            this.loadSelectOptions(attr.attributeId);
          }
        });
        this.messageService.add({ severity: 'success', summary: 'موفق', detail: 'ویژگی‌های دسته با موفقیت لود شدند', life: 3000 });
      },
      error: () => {
        // خطا توسط BaseService مدیریت می‌شود
      },
    });
  }

  loadSelectOptions(attributeId: number) {
    // فرض می‌کنیم API گزینه‌های پیشنهادی را ارائه می‌دهد
    const mockOptions = [
      { label: 'گزینه ۱', value: 'گزینه ۱' },
      { label: 'گزینه ۲', value: 'گزینه ۲' },
    ];
    this.selectOptions.update((options) => ({
      ...options,
      [attributeId]: mockOptions,
    }));
  }

  updateAttributeValuesFormArray(attributes: CategoryAttributeDTO[]) {
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
      this.messageService.add({ severity: 'warn', summary: 'هشدار', detail: 'لطفاً فرم را کامل و صحیح پر کنید.', life: 3000 });
      return;
    }

    const attributes = this.attributeValuesFormArray.value.map((val: any, i: number) => {
      const attr = this.categoryAttributes()[i];
      let value: any = val.value;

      switch (attr.attributeType) {
        case AttributeType.NUMBER:
          value = value !== null && value !== undefined ? Number(value) : 0;
          break;
        case AttributeType.BOOLEAN:
          value = Boolean(value);
          break;
        case AttributeType.MULTISELECT:
          value = Array.isArray(value) ? value.join(',') : '';
          break;
        case AttributeType.SELECT:
          value = value != null ? value.toString() : '';
          break;
        default:
          value = value != null ? value.toString() : '';
      }

      return {
        attributeId: attr.attributeId,
        value,
      };
    });

    const productDTO: ProductDTO = {
      title: this.productForm.get('title')?.value?.toString() || '',
      description: this.productForm.get('description')?.value?.toString() || '',
      price: Number(this.productForm.get('price')?.value) || 0,
      stock: Number(this.productForm.get('stock')?.value) || 0,
      categoryId: Number(this.productForm.get('categoryId')?.value),
      attributeValues: attributes,
    };

    this.productService.addProduct(productDTO).subscribe({
      next: () => {
        this.productForm.reset();
        this.categoryAttributes.set([]);
        this.attributeValuesFormArray.clear();
        this.productAdded.emit();
        this.messageService.add({ severity: 'success', summary: 'موفق', detail: 'محصول با موفقیت اضافه شد', life: 3000 });
      },
      error: () => {
        // خطا توسط BaseService مدیریت می‌شود
      },
    });
  }
}