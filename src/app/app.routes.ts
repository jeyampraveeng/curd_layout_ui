import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AuthGuard } from './guard/auth.guard';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { TextListComponent } from './text-list/text-list.component';
import { SettingsComponent } from './settings/settings.component';
import { ProjectsComponent } from './projects/projects.component';

export const routes: Routes = [
    // Default route without leading slash in redirectTo
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent },
    // Protected routes
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'about', component: AboutComponent },
    { path: 'test', component: TextListComponent },
    { path: 'settings', component: SettingsComponent },
    {path:'projects',component:ProjectsComponent},
    // Wildcard route without leading slash in redirectTo
    { path: '**', component: PageNotFoundComponent }
];