import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";

import { AuthService } from "../auth.service";

@Component({
  templateUrl: "./change.component.html",
  styleUrls: ["./change.component.css"]
})
export class ChangeComponent implements OnInit, OnDestroy {
  model: any = {};
  isLoading = false;
  private authStatusSub: Subscription;

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
  }

  onSubmit() {
    alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.model, null, 4));
  }

  onPasswordChange(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.change(form.value.email, form.value.password);
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
