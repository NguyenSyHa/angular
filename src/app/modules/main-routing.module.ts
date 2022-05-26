import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppRouteGuard } from '@shared/auth/auth-route-guard';
import { MainComponent } from './main.component';

const routes: Routes = [
    {
        path: 'customers',
        component: MainComponent,
        canActivate: [AppRouteGuard],
        children: [{
            path: '',
            children: [
                {
                    path: '',
                    loadChildren: '../modules/customer/customer.module#CustomerModule',
                    data: {
                        permission: 'Admin.Clients',
                        preload: true
                    },
                    canActivate: [AppRouteGuard],
                }
            ]
        }]
    },

    {
        path: 'users',
        component: MainComponent,
        canActivate: [AppRouteGuard],
        children: [{
            path: '',
            children: [{
                path: '',
                loadChildren: '../modules/user/user.module#UserSModule',
                data: {
                    permission: 'Admin.Users',
                    preload: true
                }
            }]
        }]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class MainRoutingModule {

}
