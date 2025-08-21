import { Component, EventEmitter, inject, input, OnChanges, OnInit, output, Output, signal, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { TreeSelectModule } from 'primeng/treeselect';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ChipsModule } from 'primeng/chips';
import { RadioButtonModule } from 'primeng/radiobutton';
import { forkJoin } from 'rxjs';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { AttributeService } from '../../../services/attribute.service';
import { AttributeType, CategoryAttributeDTO } from '../../../models/attribute.model';
import { CategoryTreeNodeDTO, ProductCondition } from '../../../models/category.model';
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';
import { SelectModule } from 'primeng/select';
import { ProductDTO } from '../../../models/product.model';

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
    CardModule,
    RadioButtonModule
],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductFormComponent implements OnInit, OnChanges {
  editingProductId = signal<number | null>(null);
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
      categoryId: [null],
      condition: ['new', Validators.required],
      attributeValues: this.fb.array([]),
    });
    
    // this.productForm.valueChanges.subscribe({
    //   next: (s)=>{
    //     console.log(s); 
    //   }
    // })

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
  resetForm() {
    this.productForm.reset();
    this.editingProductId.set(null);  
    this.categoryAttributes.set([]);   
    this.attributeValuesFormArray.clear(); 
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
      condition: this.productForm.get('condition')?.value ?? ProductCondition.NEW,
      id: 0
    };

    const id = this.editingProductId(); 
  if (id !== null) {                  
    this.productService.updateProduct(id, productDTO).subscribe({
      next: () => {
        this.resetForm();
        this.productAdded.emit();
        this.messageService.add({ severity: 'success', summary: 'موفق', detail: 'محصول ویرایش شد', life: 3000 });
      }
    });
  } else {
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
}





// @Component({
//   selector: 'app-product-form',
//   standalone: true,
//   imports: [
//     CommonModule,
//     ReactiveFormsModule,
//     InputTextModule,
//     InputNumberModule,
//     ButtonModule,
//     MultiSelectModule,
//     TreeSelectModule,
//     AutoCompleteModule,
//     ChipsModule,
//     RadioButtonModule,
//     DropdownModule,
//     CheckboxModule,
//     CardModule,
//     FormsModule,
//   ],
//   templateUrl: './product.component.html',
//   styleUrls: ['./product.component.css'],
// })
// export class ProductFormComponent implements OnInit {
//   @Output() productAdded = new EventEmitter<void>();

//   productForm!: FormGroup;
//   AttributeType = AttributeType;
//   // selectedFile: File | null = null;  // File upload temporarily disabled
//   categories = signal<any[]>([]);
//   categoryAttributes = signal<CategoryAttributeDTO[]>([]);
//   selectOptions: { [key: number]: any[] } = {};
//   filteredOptions: { [key: number]: any[] } = {};
//   private fb = inject(FormBuilder);
//   private productService = inject(ProductService);
//   private categoryService = inject(CategoryService);
//   private attributeService = inject(AttributeService);

//   constructor(private messageService: MessageService) {}

//   ngOnInit() {
//     this.productForm = this.fb.group({
//       title: ['', Validators.required],
//       description: [''],
//       price: [0, [Validators.required, Validators.min(0)]],
//       stock: [0, [Validators.required, Validators.min(0)]],
//       condition: ['new', Validators.required],
//       categoryId: [null, Validators.required],
//       attributeValues: this.fb.array([]),
//     });

//     this.loadCategories();
//   }

//   get attributeValuesFormArray(): FormArray {
//     return this.productForm.get('attributeValues') as FormArray;
//   }

//   getValueControl(index: number): FormControl {
//     return this.attributeValuesFormArray.at(index).get('value') as FormControl;
//   }

//   private loadCategories() {
//     this.categoryService.getCategories().subscribe((cats) => {
//       this.categories.set(this.mapToTreeNodes(cats));
//     });
//   }

//   private mapToTreeNodes(categories: CategoryTreeNodeDTO[]): any[] {
//     return categories.map(cat => ({
//       key: cat.key,
//       label: cat.label || 'بدون نام',
//       data: { id: cat.data.id },
//       children: cat.children ? this.mapToTreeNodes(cat.children) : [],
//     }));
//   }

//   onCategorySelect(event: any) {
//     const node = event?.node;
//     if (!node) return;

//     this.productForm.patchValue({ categoryId: node.data.id });
//     const path = this.findCategoryPathByKey(this.categories(), node.key);
//     this.loadInheritedAttributesForPath(path);
//   }

//   private findCategoryPathByKey(nodes: any[], key: string, trail: any[] = []): any[] {
//     for (const n of nodes) {
//       const nextTrail = [...trail, n];
//       if (n.key === key) return nextTrail;
//       if (n.children?.length) {
//         const found = this.findCategoryPathByKey(n.children, key, nextTrail);
//         if (found.length) return found;
//       }
//     }
//     return [];
//   }

//   private loadInheritedAttributesForPath(pathNodes: any[]) {
//     this.categoryAttributes.set([]);
//     this.attributeValuesFormArray.clear();
//     if (!pathNodes.length) return;

//     const requests = pathNodes.map(n => this.attributeService.getCategoryAttributes(n.data.id));
//     forkJoin(requests).subscribe((lists: CategoryAttributeDTO[][]) => {
//       const merged: CategoryAttributeDTO[] = [];
//       const seen = new Set<number>();
//       for (const list of lists) {
//         for (const attr of list) {
//           if (!seen.has(attr.attributeId)) {
//             seen.add(attr.attributeId);
//             merged.push(attr);
//           }
//         }
//       }
//       this.categoryAttributes.set(merged);
//       this.updateAttributeValuesFormArray(merged);

//       merged.forEach(attr => {
//         if ([AttributeType.SELECT, AttributeType.MULTISELECT].includes(attr.attributeType)) {
//           this.loadSelectOptions(attr.attributeId);
//         }
//       });
//     });
//   }

//   private updateAttributeValuesFormArray(attributes: CategoryAttributeDTO[]) {
//     this.attributeValuesFormArray.clear();
//     attributes.forEach(attr => {
//       const defaultValue = attr.attributeType === AttributeType.BOOLEAN ? false :
//         attr.attributeType === AttributeType.MULTISELECT ? [] : '';
//       this.attributeValuesFormArray.push(
//         this.fb.group({
//           attributeId: [attr.attributeId],
//           value: [defaultValue, attr.required ? Validators.required : []]
//         })
//       );
//     });
//   }

//   private loadSelectOptions(attributeId: number) {
//     this.selectOptions[attributeId] = [
//       { label: 'گزینه اول', value: 'گزینه اول' },
//       { label: 'گزینه دوم', value: 'گزینه دوم' },
//     ];
//     this.filteredOptions[attributeId] = [...this.selectOptions[attributeId]];
//   }

//   onSearch(event: any, attributeId: number) {
//     const options = this.selectOptions[attributeId] || [];
//     this.filteredOptions[attributeId] = options.filter(opt =>
//       opt.label.toLowerCase().includes(event.query.toLowerCase())
//     );
//   }

//   // File upload temporarily disabled
//   // onFileBrowse(event: any) {
//   //   const files: FileList = event.target.files;
//   //   if (files && files.length > 0) {
//   //     this.selectedFile = files[0]; 
//   //   }
//   // }

//   onSubmit() {
//     if (!this.productForm.valid) return;

//     const attributes = this.attributeValuesFormArray.value.map((val: any, i: number) => {
//       const attr = this.categoryAttributes()[i];
//       let value: any = val.value;

//       switch (attr.attributeType) {
//         case AttributeType.NUMBER:
//           value = value != null ? Number(value) : 0;
//           break;
//         case AttributeType.BOOLEAN:
//           value = Boolean(value);
//           break;
//         case AttributeType.MULTISELECT:
//           value = Array.isArray(value) ? value.join(',') : '';
//           break;
//         default:
//           value = value != null ? value.toString() : '';
//       }

//       return { attributeId: attr.attributeId, value };
//     });

//     const formData = new FormData();
//     formData.append('title', this.productForm.value.title);
//     formData.append('description', this.productForm.value.description);
//     formData.append('price', String(this.productForm.value.price));
//     formData.append('stock', String(this.productForm.value.stock));
//     formData.append('condition', this.productForm.value.condition);
//     formData.append('categoryId', String(this.productForm.value.categoryId));
//     formData.append('attributeValues', JSON.stringify(attributes));

//     // File upload temporarily disabled
//     // if (this.selectedFile) {
//     //   formData.append('photo', this.selectedFile, this.selectedFile.name);
//     // }

//     this.productService.addProduct(formData).subscribe({
//       next: () => {
//         this.productForm.reset({ condition: 'new', price: 0, stock: 0 });
//         this.categoryAttributes.set([]);
//         this.attributeValuesFormArray.clear();
//         // this.selectedFile = null; // file upload disabled
//         this.productAdded.emit();
//       },
//       error: (err) => {
//         console.error('Product submission error:', err);
//         this.messageService?.add({ 
//           severity: 'error', 
//           summary: 'Error', 
//           detail: err?.error?.message || 'Failed to add product' 
//         });
//       }
//     });
//   }
// }
