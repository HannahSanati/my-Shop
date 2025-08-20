import { Routes } from '@angular/router';

export const routes: Routes = [
  // default
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./components/home/home.component')
        .then(c => c.HomeComponent),
  },
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
    import('./components/tree-view/tree-view.component')
        .then(c => c.TreeViewComponent),
  },
  {
    path: 'add-product',
    loadComponent: () =>
      import('./components/product/product.component')
        .then(c => c.ProductFormComponent),
  },
  {
    path: 'product-list',
    loadComponent: () =>
      import('./components/product-list/product-list/product-list.component')
        .then(c => c.ProductListComponent),
  },
];