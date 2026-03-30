import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  // { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./design/homepage/homepage').then(m => m.Homepage)
  },
  {
    path: 'auth',
    canActivate: [guestGuard],
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  }, 
  {
    path: 'homepage',
    
    loadComponent: () => import('./design/homepage/homepage').then(m => m.Homepage)
  },
  {
    path: 'about',
    loadComponent: () => import('./design/about/about').then(m => m.About)
  },
  {
    path: 'contact',
    loadComponent: () => import('./design/contact/contact').then(m => m.Contact)
  },
  {
    path: 'manysilos',
    loadComponent: () => import('./design/silos/silos').then(m => m.Silos)
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./shared/components/shell/shell.component').then(m => m.ShellComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'silos',
        loadComponent: () => import('./features/silos/silos-list/silos-list.component').then(m => m.SilosListComponent)
      },
      {
        path: 'silos/:id',
        loadComponent: () => import('./features/silos/silo-detail/silo-detail.component').then(m => m.SiloDetailComponent)
      },
      {
        path: 'silos/:siloId/challenges/:id',
        loadComponent: () => import('./features/challenges/challenge-detail/challenge-detail.component').then(m => m.ChallengeDetailComponent)
      },
      {
        path: 'cross-silo',
        loadComponent: () => import('./features/cross-silo/cross-silo.component').then(m => m.CrossSiloComponent)
      },
      {
        path: 'consultations',
        loadComponent: () => import('./features/consultations/consultations.component').then(m => m.ConsultationsComponent)
      },
      {
        path: 'notifications',
        loadComponent: () => import('./features/notifications/notifications.component').then(m => m.NotificationsComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent)
      },
      {
      path: 'back',
      loadComponent: () => import('./design/homepage/homepage').then(m => m.Homepage)
    },
    {
      path: 'about',
      
      loadComponent: () => import('./design/about/about').then(m => m.About)
    },
    {
      path: 'contact',
      
      loadComponent: () => import('./design/contact/contact').then(m => m.Contact)
    },
    {
      path: 'manysilos',
      
      loadComponent: () => import('./design/silos/silos').then(m => m.Silos)
    },
    ]
  },
  // { path: '**', redirectTo: '/dashboard' }
];
