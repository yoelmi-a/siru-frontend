import { Routes } from '@angular/router';
import { AuthLayout } from './layout/auth-layout/auth-layout';
import { LoginPage } from './pages/login-page/login-page';
import { ForgotPasswordPage } from './pages/forgot-password-page/forgot-password-page';
import { ResetPasswordPage } from './pages/reset-password-page/reset-password-page';

export const authRoutes: Routes = [
  {
    path: '',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        component: LoginPage
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordPage
      },
      {
        path: 'reset-password',
        component: ResetPasswordPage
      },
      {
        path: '**',
        redirectTo: 'login'
      }
    ]
  }
];

export default authRoutes;
