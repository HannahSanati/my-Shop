import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ToolbarModule, ButtonModule, AvatarModule, MenubarModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  items: MenuItem[] = [
    {
      label: 'خانه',
      icon: 'pi pi-home',
      ariaLabel: 'ناوبری به صفحه خانه',
      command: () => this.navigateTo('home')
    },
    {
      label: 'دسته‌بندی‌ها',
      icon: 'pi pi-list',
      ariaLabel: 'منوی دسته‌بندی‌ها',
      items: [
        {
          label: 'افزودن دسته‌بندی جدید',
          icon: 'pi pi-plus',
          ariaLabel: 'ناوبری به افزودن دسته‌بندی جدید',
          command: () => this.navigateTo('category-management')
        },
        {
          label: 'مشاهده دسته‌بندی‌ها',
          ariaLabel: 'ناوبری به مشاهده دسته‌بندی‌ها',
          command: () => this.navigateTo('tree-view')
        }
      ]
    },
    {
      label: 'محصولات',
      icon: 'pi pi-tags',
      ariaLabel: 'منوی محصولات',
      items: [
        {
          label: 'افزودن محصولات',
          icon: 'pi pi-plus',
          ariaLabel: 'ناوبری به افزودن محصولات',
          command: () => this.navigateTo('add-product')
        },
        {
          label: 'لیست محصولات',
          ariaLabel: 'ناوبری به لیست محصولات',
          command: () => this.navigateTo('product-list')
        }
      ]
    },
    {
      label: 'حساب کاربری',
      icon: 'pi pi-user',
      ariaLabel: 'ناوبری به حساب کاربری',
      command: () => this.navigateTo('admin')
    }
  ];

  constructor(private router: Router) {}

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}