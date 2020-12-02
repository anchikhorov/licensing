import { Component, OnInit, OnDestroy } from "@angular/core";
import { MatPaginatorIntl, PageEvent } from "@angular/material/paginator";
import { Subscription } from "rxjs";
//import { map} from 'rxjs/operators';

import { Customer } from "../customers.model";
import { CustomersService } from "../customers.service";
import { AuthService } from "../../auth/auth.service";
//import { HttpResponse } from '@angular/common/http';

@Component({
  selector: "app-customer-list",
  templateUrl: "./customer-list.component.html",
  styleUrls: ["./customer-list.component.css"]
})
export class CustomerListComponent implements OnInit, OnDestroy {
  customers: Customer[] = [];
  isLoading = false;
  totalCustomers = 0;
  customersPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userId: string;
  private customersSub: Subscription;
  private authStatusSub: Subscription;

  constructor(
    public customersService: CustomersService,
    private authService: AuthService,
    private paginator: MatPaginatorIntl
  ) {
    this.paginator.itemsPerPageLabel = 'Записей на странице:';
    this.paginator.nextPageLabel = 'Следущая страница';
    this.paginator.previousPageLabel = 'Предыдущая страница';
  }

  ngOnInit() {
    this.isLoading = true;
    this.customersService.getCustomers(this.customersPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.customersSub = this.customersService
      .getCustomerUpdateListener()
      .subscribe((customerData: { customers: Customer[]; customerCount: number }) => {
        this.isLoading = false;
        this.totalCustomers = customerData.customerCount;
        this.customers = customerData.customers;
        //console.log(this.posts)
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.customersPerPage = pageData.pageSize;
    this.customersService.getCustomers(this.customersPerPage, this.currentPage);
  }

  onDelete(customerId: string) {
    console.log(customerId)
    this.isLoading = true;
    this.customersService.deleteCustomer(customerId).subscribe(() => {
      this.customersService.getCustomers(this.customersPerPage, this.currentPage);
    }, () => {
      this.isLoading = false;
    });
  }

  // onGetLic(customerId: string) {
  //   //this.isLoading = true;
  //   this.customersService.getLic(customerId)
  //   .subscribe(data => {
  //     const blob: Blob = new Blob([data], { type: 'text/plain' });
  //     //console.log(blob)
  //     const fileName = `${postId}.lic`;
  //     const objectUrl: string = URL.createObjectURL(blob);
  //     const a: HTMLAnchorElement = document.createElement('a') as HTMLAnchorElement;

  //     a.href = objectUrl;
  //     a.download = fileName;
  //     document.body.appendChild(a);
  //     a.click();

  //     document.body.removeChild(a);
  //     URL.revokeObjectURL(objectUrl);
  //   },
  //   error => console.log('oops', error)
  // );
  // }

  ngOnDestroy() {
    this.customersSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
