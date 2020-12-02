import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  templateUrl: "./message.component.html",
  selector: "app-message",

})
export class MessageComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string }) {}

}
