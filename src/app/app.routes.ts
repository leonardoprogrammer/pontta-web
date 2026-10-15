import { Routes } from '@angular/router';

export const routes: Routes = [
    {
    path: '',
    pathMatch: 'full',
    title: 'CRUD',
    loadComponent: () => import('./components/cliente/cliente.component').then((m) => m.ClienteComponent),
  }
];
