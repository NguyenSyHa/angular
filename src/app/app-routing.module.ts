import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AppRouteGuard } from '@shared/auth/auth-route-guard';
import { UsersComponent } from './users/users.component';
import { TenantsComponent } from './tenants/tenants.component';
import { ChangePasswordComponent } from './users/change-password/change-password.component';
import { NoPermissionComponent } from '@shared/interceptor-errors/no-permission/no-permission.component';

const routes: Routes = [
    {
        path: '',
        component: AppComponent,
        canActivate: [AppRouteGuard],
        children: [
            { path: 'users', component: UsersComponent, data: { permission: 'Admin.Users' }, canActivate: [AppRouteGuard] },
            { path: 'tenants', component: TenantsComponent, data: { permission: 'Tenants' }, canActivate: [AppRouteGuard] },
            { path: 'update-password', component: ChangePasswordComponent },
            { path: 'no-permission', component: NoPermissionComponent },
        ]
    },
    {
        path: 'main',
        component: AppComponent,
        canActivate: [AppRouteGuard],
        children: [{
            path: '',
            children: [
                {
                    path: '',
                    loadChildren: './modules/main.module#MainModule',
                    data: {
                        preload: true
                    }
                }
            ]
        }]
    }
]

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
