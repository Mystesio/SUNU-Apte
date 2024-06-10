import { Routes } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { LoginComponent } from 'app/login/login.component';

export const AdminLayoutRoutes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' }, // Redirection par défaut vers la page de login
    { path: 'dashboard', component: DashboardComponent },
    { path: 'login', component: LoginComponent },
];