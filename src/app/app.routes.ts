import { Routes } from '@angular/router';

export const routes: Routes = [
    // default🫡
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
];

// {
//   path:'test',
//   loadComponent: () =>
//     import('./testprimeng/testprimeng.component')
//      .then(c => c.TestprimengComponent)
// }
