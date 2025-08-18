import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/admin',
    pathMatch: 'full',
  },
  // {
  //   path: 'home',
  //   loadComponent: () =>
  //     import('./components/home/home.component')
  //       .then(c => c.HomeComponent),
  // },
  {
    path: 'admin',
    loadComponent: () =>
      import('./components/admin-dashboard/admin-dashboard.component')
        .then(c => c.AdminDashboardComponent),
  },
  {
    path: 'add-category',
    loadComponent: () =>
      import('./components/category-form/category-form.component')
        .then(c => c.CategoryFormComponent),
  },
  {
    path: 'categories',
    loadComponent: () =>
    import('./components/category-tree/category-tree.component')
        .then(c => c.CategoryTreeComponent),
  },
  {
    path: 'add-product',
    loadComponent: () =>
      import('./components/product-form/product-form.component')
        .then(c => c.ProductFormComponent),
  },
  {
    path: 'product-list',
    loadComponent: () =>
      import('./components/product-list/product-list.component')
        .then(c => c.ProductListComponent),
  },
];