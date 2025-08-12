import { Component, signal, input, output, OnInit, inject, effect, SimpleChanges, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { AttributeService } from '../../services/attribute.service';
import { Category, CategoryDTO, CategoryTreeNodeDTO } from '../../models/category.model';
import { Attribute, CategoryAttribute, CategoryAttributeDTO, AttributeType } from '../../models/attribute.model';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    SelectModule,
    CheckboxModule,
    ButtonModule,
  ],
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit, OnChanges {
  categoryId = input<number | null>(null);
  categoryUpdated = output<void>();
  categoryForm!: FormGroup;
  categories = signal<{ label: string, value: number | null }[]>([]);
  attributeTypes = signal([
    { label: 'رشته', value: AttributeType.STRING },
    { label: 'عدد', value: AttributeType.NUMBER },
    { label: 'بولی', value: AttributeType.BOOLEAN },
    { label: 'انتخابی', value: AttributeType.SELECT },
    { label: 'چند انتخابی', value: AttributeType.MULTISELECT }
  ]);
  categoryAttributes = signal<CategoryAttribute[]>([]);
  editMode = signal(false);
  private categoryService = inject(CategoryService);
  private attributeService = inject(AttributeService);

  constructor(private fb: FormBuilder) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      parentId: [null],
      attributeName: [''],
      attributeType: [null],
      required: [false]
    });
    effect(() => {
      this.loadCategories();
    });

    
  }

  ngOnInit() {
    this.loadCategories();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['categoryId'] && this.categoryId() !== null) {
      this.loadFormData();
    } else if (this.categoryId() === null) {
      this.editMode.set(false);
      this.categoryForm.reset();
      this.categoryAttributes.set([]);
    }
  }

  private loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (cats) => {
        const flatCategories = this.flattenCategories(cats);
        this.categories.set([
          { label: 'بدون والد', value: null },
          ...flatCategories.map(cat => ({ label: cat.name, value: cat.id }))
        ]);
      },
      error: (err) => {
        console.error('خطا در لود دسته‌بندی‌ها:', err);
        alert('خطایی در لود دسته‌بندی‌ها رخ داد.');
      }
    });
  }

  private loadFormData() {
    this.editMode.set(true);
    this.categoryService.getCategory(this.categoryId()!).subscribe({
      next: (category) => {
        this.categoryForm.patchValue({
          name: category.name,
          description: category.description,
          parentId: category.parentId
        });
      },
      error: (err) => {
        console.error('خطا در لود دسته‌بندی:', err);
        alert('خطایی در لود دسته‌بندی رخ داد.');
      }
    });
    this.attributeService.getCategoryAttributes(this.categoryId()!).subscribe({
      next: (attrs) => {
        this.categoryAttributes.set(attrs);
      },
      error: (err) => {
        console.error('خطا در لود ویژگی‌های دسته‌بندی:', err);
        alert('خطایی در لود ویژگی‌های دسته‌بندی رخ داد.');
      }
    });
  }


  private flattenCategories(nodes: CategoryTreeNodeDTO[]): Category[] {
  return nodes.flatMap(node => [
    {
      id: node.data.id,
      name: node.label, 
      description: node.data.description,
      parentId: null, 
      children: []
    },
    ...this.flattenCategories(node.children || [])
  ]);
}

  addAttribute() {
    const attributeName = this.categoryForm.get('attributeName')?.value;
    const attributeType = this.categoryForm.get('attributeType')?.value;
    const required = this.categoryForm.get('required')?.value;
    if (!attributeName || !attributeType) {
      alert('نام و نوع ویژگی اجباری است');
      return;
    }
    const newAttribute: Attribute = {
      id: 0,
      name: attributeName,
      type: attributeType
    };
    this.attributeService.addAttribute(newAttribute).subscribe({
      next: (addedAttribute) => {
        const newCatAttr: CategoryAttribute = {
          id: 0,
          attributeId: addedAttribute.id,
          attributeName: attributeName,
          attributeType: attributeType,
          required: required
        };
        this.categoryAttributes.update(attrs => [...attrs, newCatAttr]);
        this.categoryForm.patchValue({ attributeName: '', attributeType: null, required: false });
      },
      error: (err) => {
        console.error('خطا در افزودن ویژگی:', err);
        alert('خطایی در افزودن ویژگی رخ داد.');
      }
    });
  }

  removeAttribute(index: number) {
    const attr = this.categoryAttributes()[index];
    if (attr.id) {
      this.attributeService.deleteCategoryAttribute(attr.id).subscribe({
        next: () => {
          this.categoryAttributes.update(attrs => attrs.filter((_, i) => i !== index));
        },
        error: (err) => {
          console.error('خطا در حذف ویژگی دسته‌بندی:', err);
          alert('خطایی در حذف ویژگی رخ داد.');
        }
      });
    } else {
      this.categoryAttributes.update(attrs => attrs.filter((_, i) => i !== index));
    }
  }
  
  onSubmit() {
    if (this.categoryForm.valid) {
        const attributeName = this.categoryForm.get('attributeName')?.value;
        const attributeType = this.categoryForm.get('attributeType')?.value;
        if (attributeName || attributeType) {
            alert('ویژگی جدید وارد شده اما اضافه نشده است. لطفاً ابتدا ویژگی را اضافه کنید.');
            return;
        }
        if (this.categoryAttributes().length === 0) {
            alert('حداقل یک ویژگی اضافه کنید.');
            return;
        }
        const categoryDTO: CategoryDTO = {
            name: this.categoryForm.get('name')?.value,
            description: this.categoryForm.get('description')?.value,
            parentId: this.categoryForm.get('parentId')?.value
        };

        const categoryRequest = this.editMode()
            ? this.categoryService.updateCategory(this.categoryId()!, categoryDTO)
            : this.categoryService.addCategory(categoryDTO);

        categoryRequest.subscribe({
            next: (category) => {
                console.log('پاسخ سرور:', category); // لاگ برای دیباگ
                const categoryId = category.id;
                if (!categoryId) {
                    console.error('categoryId null است:', category);
                    alert('خطا: شناسه دسته‌بندی معتبر نیست.');
                    return;
                }
                this.categoryAttributes().forEach(attr => {
                    if (!attr.id) {
                        const categoryAttributeDTO: CategoryAttributeDTO = {
                            categoryId,
                            attributeId: attr.attributeId,
                            required: attr.required
                        };
                        if (!categoryAttributeDTO.categoryId || !categoryAttributeDTO.attributeId) {
                            console.error('DTO ناقص است:', categoryAttributeDTO);
                            return;
                        }
                        this.attributeService.addCategoryAttribute(categoryAttributeDTO).subscribe({
                            next: (newCatAttr) => {
                                this.categoryAttributes.update(attrs =>
                                    attrs.map(a => (a.attributeId === attr.attributeId && !a.id ? { ...a, id: newCatAttr.id } : a))
                                );
                            },
                            error: (err) => {
                                console.error('خطا در افزودن ویژگی دسته‌بندی:', err);
                                alert('خطایی در افزودن ویژگی رخ داد.');
                            }
                        });
                    }
                });
                this.categoryUpdated.emit();
                this.loadCategories();
                this.categoryForm.reset();
                this.categoryAttributes.set([]);
                this.editMode.set(false);
            },
            error: (err) => {
                console.error('خطا در ذخیره دسته‌بندی:', err);
                alert('خطایی در ذخیره دسته‌بندی رخ داد.');
            }
        });
    }
}
}