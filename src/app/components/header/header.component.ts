import { Component } from '@angular/core';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from "primeng/button";
import { Router } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-header',
  imports: [ToolbarModule, ButtonModule, AvatarModule,ToolbarModule, MenubarModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  items: MenuItem[];
  navigateTo(route: string) {
    this.router.navigate([route]);
  }
  constructor(private router: Router) {
    this.items = [
      {
        label: 'خانه',
        icon: 'pi pi-home',
        command: () => this.navigateTo('home')
      },
      {
        label: 'دسته‌بندی‌ها',
        icon: 'pi pi-list',
        items: [
          {
            label: 'افزودن دسته‌بندی جدید',
            icon: 'pi pi-plus',
            command: () => this.navigateTo('add-category')
          },
          {
            label: 'مشاهده دسته‌بندی‌ها',
            command: () => this.navigateTo('categories')
          }
        ]
      },
      {
        label: 'محصولات',
        icon: 'pi pi-tags',
        items: [
          {
            label: 'افزودن محصولات',
            icon: 'pi pi-plus',
            command: () => this.navigateTo('add-product')
          },
          {
            label: 'لیست محصولات',
            command: () => this.navigateTo('product-list')
          }
        ]
      },
      {
        label: 'حساب کاربری',
        icon: 'pi pi-user',
        command: () => this.navigateTo('admin')
      }
    ];
  }

  }



 
 // public isLoggedIn() {
  //   return this.userAuthService.isLoggedIn();
  // }

  // public logout() {
  //   this.userAuthService.clear();
  //   this.router.navigate(['/']);
  // }

  // public isAdmin(){
  //   return this.userAuthService.isAdmin();
  // }

  // public isUser(){
  //   return this.userAuthService.isUser();
  // }
