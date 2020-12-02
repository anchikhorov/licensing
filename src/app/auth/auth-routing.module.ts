import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { LoginComponent } from "./login/login.component";
import { ResetComponent } from './reset/reset.component';
import { SignupComponent } from "./signup/signup.component";
import { ChangeComponent } from './change/change.component';

const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "signup", component: SignupComponent },
  { path: "reset", component: ResetComponent},
  { path: "change", component: ChangeComponent}
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
