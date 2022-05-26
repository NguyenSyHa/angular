import { UploadAvatarComponent } from './modules/user/upload-avatar/upload-avatar.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JsonpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';

import { ModalModule } from 'ngx-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AbpModule } from '@abp/abp.module';

import { ServiceProxyModule } from '@shared/service-proxies/service-proxy.module';
import { SharedModule } from '@shared/shared.module';

import {MatFormFieldModule} from '@angular/material/form-field';

import { TopBarComponent } from '@app/layout/topbar.component';
import { TopBarLanguageSwitchComponent } from '@app/layout/topbar-languageswitch.component';
import { SideBarUserAreaComponent } from '@app/layout/sidebar-user-area.component';
import { SideBarNavComponent } from '@app/layout/sidebar-nav.component';
import { SideBarFooterComponent } from '@app/layout/sidebar-footer.component';
import { RightSideBarComponent } from '@app/layout/right-sidebar.component';
// tenants
import { TenantsComponent } from '@app/tenants/tenants.component';
import { CreateTenantDialogComponent } from './tenants/create-tenant/create-tenant-dialog.component';
import { EditTenantDialogComponent } from './tenants/edit-tenant/edit-tenant-dialog.component';
// roles
// users
import { UsersComponent } from '@app/users/users.component';
import { CreateEditUserComponent } from './users/create-edit-user/create-edit-user-dialog.component';
import { ChangePasswordComponent } from './users/change-password/change-password.component';
import { ResetPasswordDialogComponent } from './users/reset-password/reset-password.component';


//configuration
// import { ImageCropperModule } from 'ngx-image-cropper';
import {MatListModule} from '@angular/material/list';


// google single sign-on
import { SocialLoginModule, AuthServiceConfig } from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';
import { AppConsts } from '@shared/AppConsts';
import { NgxCurrencyModule } from 'ngx-currency';
import { EditSidebarComponent } from './layout/edit-sidebar/edit-sidebar.component';

let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider(AppConsts.googleClientAppId != '' ? AppConsts.googleClientAppId : '213950513725-ui8vol0d67lqqbjmne2edrr255u527v5.apps.googleusercontent.com' )
  }
]);

export function provideConfig() {
  return config;
}
@NgModule({
  declarations: [
    AppComponent,
    TopBarComponent,
    TopBarLanguageSwitchComponent,
    SideBarUserAreaComponent,
    SideBarNavComponent,
    SideBarFooterComponent,
    RightSideBarComponent,
    // tenants
    TenantsComponent,
    CreateTenantDialogComponent,
    EditTenantDialogComponent,
    // roles
    // users
    UsersComponent,
    CreateEditUserComponent,
    ChangePasswordComponent,
    ResetPasswordDialogComponent,
    //configurations
    UploadAvatarComponent,
    EditSidebarComponent,

  ],
  imports: [
    SocialLoginModule,
    // ImageCropperModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    JsonpModule,
    ModalModule.forRoot(),
    AbpModule,
    AppRoutingModule,
    ServiceProxyModule,
    SharedModule,
    NgxPaginationModule,
    MatFormFieldModule,
    NgxCurrencyModule,
    MatListModule,
  ],
  providers: [
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    }
  ],
  entryComponents: [
    EditSidebarComponent,
    // tenants
    CreateTenantDialogComponent,
    EditTenantDialogComponent,
    // roles
    // users
    CreateEditUserComponent,
    ResetPasswordDialogComponent,
    UploadAvatarComponent,
  ]
})
export class AppModule {}
