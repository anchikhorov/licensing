import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpResponse
  } from "@angular/common/http";
  import { map} from 'rxjs/operators';

  import { Injectable } from "@angular/core";
  import { MatDialog } from "@angular/material/dialog";
  
  import { MessageComponent } from "./message/message.component";
  import { MessageService } from "./message/message.service";

  
  @Injectable()
  export class MessageInterceptor implements HttpInterceptor {
  
    constructor(private dialog: MatDialog, private messageService: MessageService) {}
  
    intercept(req: HttpRequest<any>, next: HttpHandler) { 
        return next.handle(req).pipe(
            map((event: HttpEvent<any>) => {
                
                // console.log("event.type > 0",event.type > 0)

              if (event instanceof HttpResponse ) {

                let bodyMessage;
                if (event.body.message) {
                    bodyMessage = event.body.message;
                    this.dialog.open(MessageComponent, {data: {message: bodyMessage}});
                  }

                return event;
              }
            })
          );

    }
  }
  