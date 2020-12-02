import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PostListComponent } from "./posts/post-list/post-list.component";
import { PostCreateComponent } from "./posts/post-create/post-create.component";
import { AuthGuard } from "./auth/auth.guard";
import { CustomerCreateComponent } from './customers/customer-create/customer-create.component';
import { CustomerListComponent } from './customers/customer-list/customer-list.component';



const routes: Routes = [
  { path: "liclist", component: PostListComponent },
  { path: "addcustomer", component: CustomerCreateComponent, canActivate: [AuthGuard] },
  { path: "customerlist", component: CustomerListComponent, canActivate: [AuthGuard] },
  { path: "create", component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: "editlic/:postId", component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: "editcustomer/:customerId", component: CustomerCreateComponent, canActivate: [AuthGuard] },
  { path: "auth", loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
