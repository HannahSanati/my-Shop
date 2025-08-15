import { Routes } from '@angular/router';

export const routes: Routes = [
  // default
  {
    path: '',
    redirectTo: '/admin',
    pathMatch: 'full',
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./components/admin-dashboard/admin-dashboard.component')
        .then(c => c.AdminDashboardComponent),
  },
  {
    path: 'category-layout',
    loadComponent: () =>
      import('./components/category-layout/category-layout.component')
        .then(c => c.CategoryLayoutComponent),
  },
  {
    path: 'product-layout',
    loadComponent: () =>
      import('./components/product-layout/product-layout.component')
        .then(c => c.ProductLayoutComponent),
  },
];

// {
//   path:'test',
//   loadComponent: () =>
//     import('./testprimeng/testprimeng.component')
//      .then(c => c.TestprimengComponent)
// }

