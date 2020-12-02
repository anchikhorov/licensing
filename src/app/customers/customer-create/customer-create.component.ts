import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Subscription } from "rxjs";

import { CustomersService } from "../customers.service";
import { Customer } from "../customers.model";
//import { mimeType } from "./mime-type.validator";
import { AuthService } from "../../auth/auth.service";

@Component({
  selector: "app-customer-create",
  templateUrl: "./customer-create.component.html",
  styleUrls: ["./customer-create.component.css"]
})
export class CustomerCreateComponent implements OnInit, OnDestroy {
  enteredTitle = "";
  enteredContent = "";
  customer: Customer;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private mode = "create";
  private customerId: string;
  private authStatusSub: Subscription;

  constructor(
    public customersService: CustomersService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) {}

//   selectedCurrency: string;

lictypes = [
    { value: 'на 30 дней'},
    { value: 'постоянная'}
];

orgnames = [
  { value: 'ООО "Рога и Копыта"' },
  { value: 'АО "Пупкин и сыновья"'},
  { value: 'Артель "Напрасный труд"' },
  { value: 'Совхоз "Красный лапоть"'},
];

appversions = [
  {value: "1.0.1"},
  {value: "1.0.2"},
  {value: "1.0.3"}
]

appnames = [
  {value: "FreeFlowCore"},
  {value: "Infolio"},
  {value: "Уис Лайт"}
]

countryes = [
  { value: 'Россия' },
  { value: 'Белоруссия'},
  { value: 'Украина'},
  { value: 'Казахстан' }
];


//  licControl = new FormControl(this.lictypes[1].viewValue);
orgNameSelectedValue: string;
licTipeSelectedValue: string;
appVersionSelectedValue: string;
appNameSelectedValue: string;
countrySelectedValue: string;
customersPerPage: number = 0;
currentPage: number = 0;


  ngOnInit() {
  
    this.authStatusSub = this.authService
   
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      });
    this.form = new FormGroup({
      orgname: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      country: new FormControl(null, { validators: [Validators.required] }),
      email: new FormControl(null, { validators: [Validators.required, Validators.email] }),
      firstname: new FormControl(null, { validators: [Validators.required] }),
      lastname: new FormControl(null, { validators: [Validators.required] }),
      locality: new FormControl(null, { validators: [Validators.required] }),
      street: new FormControl(null, { validators: [Validators.required] }),
      house: new FormControl(null, { validators: [Validators.required] }),
      phone: new FormControl(null, { validators: [Validators.required] }),
      //licversion: new FormControl(null, { validators: [Validators.required] }),
      //serialnumber: new FormControl(null, { validators: [Validators.required] }),
    });
    //this.customersService.getCustomers(this.customersPerPage, this.currentPage);
    //console.log("this.customersService", this.customersService)
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("customerId")) {
        this.mode = "edit";
        this.customerId = paramMap.get("customerId");
        this.isLoading = true;
        this.customersService.getCustomer(this.customerId).subscribe(customerData => {
          this.isLoading = false;
          this.customer = {
            id: customerData._id,
            orgname: customerData.orgname,
            country: customerData.country,
            firstname: customerData.firstname,
            lastname: customerData.lastname,
            email: customerData.email,
            locality: customerData.locality,
            street: customerData.street,
            house: customerData.house,
            phone: customerData.phone,
            //serialnumber: postData.serialnumber,
            creator: customerData.creator
          };
          this.form.setValue({
            orgname: this.customer.orgname,
            country: this.customer.country,
            firstname: this.customer.firstname,
            lastname: this.customer.lastname,
            email: this.customer.email,
            locality: this.customer.locality,
            street: this.customer.street,
            house: this.customer.house,
            phone: this.customer.phone,
          });
        });
      } else {
        this.mode = "create";
        this.customerId = null;
      }
    });
  }

  onSaveCustomer() {
    //console.log("this.form.invalid", this.form.invalid)
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === "create") {
      this.customersService.addCustomer(
        this.form.value.orgname,
        this.form.value.country,
        this.form.value.email,
        this.form.value.firstname,
        this.form.value.lastname,
        this.form.value.locality,
        this.form.value.street,
        this.form.value.house,
        this.form.value.phone

        //this.form.value.serialnumber
      );
    } else {
      this.customersService.updateCustomer(
        this.customerId,
        this.form.value.orgname,
        this.form.value.country,
        this.form.value.email,
        this.form.value.firstname,
        this.form.value.lastname,
        this.form.value.locality,
        this.form.value.street,
        this.form.value.house,
        this.form.value.phone
      );
    }
    this.isLoading = false;
    //this.form.reset();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
