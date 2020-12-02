import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { AngularMaterialModule } from "../angular-material.module";
import { AuthRoutingModule } from "./auth-routing.module";
import { ResetComponent } from './reset/reset.component';
import { ChangeComponent } from './change/change.component';
import { MustMatchDirective } from './helper/must-match.directive';

@NgModule({
  declarations: [LoginComponent, SignupComponent,ResetComponent,ChangeComponent,MustMatchDirective],
  imports: [CommonModule, AngularMaterialModule, FormsModule, AuthRoutingModule]
})
export class AuthModule {}
