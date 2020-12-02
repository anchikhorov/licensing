import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { CustomerCreateComponent } from "./customer-create/customer-create.component";
//import { PostListComponent } from "./post-list/post-list.component";
import { AngularMaterialModule } from "../angular-material.module";
import { CustomerListComponent } from './customer-list/customer-list.component';

@NgModule({
  //declarations: [PostCreateComponent, PostListComponent],
  declarations: [CustomerCreateComponent, CustomerListComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule
  ]
})
export class CustomersModule {}
