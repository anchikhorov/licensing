import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

//import { environment } from "../../environments/environment";
import { Customer } from "./customers.model";

const BACKEND_URL = "api/customer/"//environment.apiUrl + "/customer/";

@Injectable({ providedIn: "root" })
export class CustomersService {
  private customers: Customer[] = [];
  private customersUpdated = new Subject<{ customers: Customer[]; customerCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getCustomers(customersPerPage: number, currentPage: number) {
    let queryParams: string = '';
    if (customersPerPage > 0 && currentPage > 0) {
      queryParams = `?pagesize=${customersPerPage}&page=${currentPage}`;
    }
    
    this.http
      .get<{ message: string; customers: any; maxcustomers: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map(customerData => {
          return {
            customers: customerData.customers.map(customer => {
              return {
                id: customer._id,
                orgname: customer.orgname,
                country: customer.country,
                email: customer.email,
                firstname: customer.firstname,
                lastname: customer.lastname,
                locality: customer.locality,
                street: customer.street,
                house: customer.house,
                phone: customer.phone,
                creator: customer.creator
              };
            }),
            maxcustomers: customerData.maxcustomers
          };
        })
      )
      .subscribe(transformedcustomerData => {
        this.customers = transformedcustomerData.customers;
        this.customersUpdated.next({
          customers: [...this.customers],
          customerCount: transformedcustomerData.maxcustomers
        });
      });
  }

  getCustomerUpdateListener() {
    return this.customersUpdated.asObservable();
  }

  getCustomer(id: string) {
    return this.http.get<{
      _id: string;
      orgname: string,
      country: string,
      email: string,
      firstname: string,
      lastname: string, 
      locality: string, 
      street: string, 
      house: string,
      phone: string
      creator: string;
    }>(BACKEND_URL + id);
  }

  addCustomer(
    orgname: string,
    country: string,
    email: string,
    firstname: string,
    lastname: string, 
    locality: string, 
    street: string, 
    house: string,
    phone: string) {
    const customerData = new FormData();
    customerData.append("orgname", orgname);
    customerData.append("country", country);
    customerData.append("email", email);
    customerData.append("firstname", firstname);
    customerData.append("lastname", lastname);
    customerData.append("locality", locality);
    customerData.append("street", street);
    customerData.append("house", house);
    customerData.append("phone", phone);
    this.http
      .post<{ message: string; Customer: Customer }>(
        BACKEND_URL,
        customerData
      )
      .subscribe(responseData => {
        this.router.navigate(["/liclist"]);
      });
  }

  updateCustomer(
    id: string,
    orgname: string,
    country: string,
    email: string,
    firstname: string,
    lastname: string, 
    locality: string, 
    street: string, 
    house: string,
    phone: string
    ) {
    let customerData: Customer | FormData;
    //if (typeof image === "object") {
    // if (typeof "image" === "object") {
    //   customerData = new FormData();
    //   customerData.append("id", id);
    //   customerData.append("orgname", orgname);
    //   customerData.append("country", country);
    //   customerData.append("email", email);
    //   customerData.append("firstname", firstname);
    //   customerData.append("lastname", lastname);
    //   customerData.append("locality", locality);
    //   customerData.append("street", street);
    //   customerData.append("house", house);
    //   customerData.append("phone", phone);
      
    //   //customerData.append("creator", creator);
    // } else {
      customerData = {
        id: id,
        orgname: orgname,
        country: country,
        email: email,
        firstname: firstname,
        lastname: lastname,
        locality: locality,
        street: street,
        house: house,
        phone: phone,
        creator: null
      };
    //}
    this.http
      .put(BACKEND_URL + id, customerData)
      .subscribe(response => {
        this.router.navigate(["/liclist"]);
      });
  }

  deleteCustomer(customerId: string) {
    return this.http.delete(BACKEND_URL + customerId);
  }
}
