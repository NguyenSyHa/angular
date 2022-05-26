import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { UserSecondComponent } from './user.component';
import { UserRoutingModule } from './user-routing.module';
import { CreateUserComponent } from './create-user/create-user.component';
import { UploadComponent } from '@shared/upload/upload.component';
import { UploadAvatarComponent } from './upload-avatar/upload-avatar.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
// import { ImageCropperModule } from 'ngx-image-cropper';
import { NgxCurrencyModule } from "ngx-currency";
import { ClickOutsideModule } from 'ng-click-outside';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { MAT_DATE_LOCALE } from '@angular/material';


@NgModule({
  declarations: [UserSecondComponent, CreateUserComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    FormsModule,
    NgxMatSelectSearchModule,
    // ImageCropperModule,
    NgxCurrencyModule,
    ClickOutsideModule,
    DragDropModule
  ],
  entryComponents: [
    CreateUserComponent,
    UploadComponent
  ],
  exports: [

  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ]
})
export class UserSModule { }

