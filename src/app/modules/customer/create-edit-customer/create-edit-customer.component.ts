import { AppComponentBase } from '@shared/app-component-base';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Optional, Injector, Inject } from '@angular/core';
import { CustomerDto } from '@app/service/model/customer.dto';

@Component({
  selector: 'app-create-edit-customer',
  templateUrl: './create-edit-customer.component.html',
  styleUrls: ['./create-edit-customer.component.css']
})
export class CreateEditCustomerComponent extends AppComponentBase implements OnInit  {
  customer = {} as CustomerDto;
  title: string;
  active: boolean = true;
  saving: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    injector: Injector,
  ) {
    super(injector);
   } 

   ngOnInit() {
    this.customer = this.data;
    this.title = this.customer.id != null ? 'Edit Client: ' : 'New Client';
  }

}
