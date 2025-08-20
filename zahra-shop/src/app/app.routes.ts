import { Routes } from '@angular/router';

export const routes: Routes = [
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
      import('./components/category/category-form/category-form.component')
        .then(c => c.CategoryFormComponent),
  },
  {
  path: 'category-management',
  loadComponent: () =>
    import('./components/category/category-management/category-management.component')
      .then(c => c.CategoryManagementComponent),
  },
  {
    path: 'categories',
    loadComponent: () =>
    import('./components/category/category-tree/category-tree.component')
        .then(c => c.CategoryTreeComponent),
  },
  {
  path: 'tree-view',
  loadComponent: () =>
    import('./components/category/tree-view/tree-view.component')
      .then(c => c.TreeViewComponent),
},
  {
    path: 'add-product',
    loadComponent: () =>
      import('./components/product/product-form/product-form.component')
        .then(c => c.ProductFormComponent),
  },
  {
    path: 'product-list',
    loadComponent: () =>
      import('./components/product/product-list/product-list.component')
        .then(c => c.ProductListComponent),
  },
];