import { Subject } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class MessageService {
  private messageListener = new Subject<string>();

  getMessageListener() {
    return this.messageListener.asObservable();
  }

  showMessage(message: string) {
    this.messageListener.next(message);
  }

  handleMesage() {
    this.messageListener.next(null);
  }
}
