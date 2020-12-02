import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Subscription } from "rxjs";

import { PostsService } from "../posts.service";
import { Post } from "../post.model";
//import { mimeType } from "./mime-type.validator";
import { AuthService } from "../../auth/auth.service";
import { CustomersService } from 'src/app/customers/customers.service';
import { Customer } from 'src/app/customers/customers.model';

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"]
})
export class PostCreateComponent implements OnInit, OnDestroy {
  enteredTitle = "";
  enteredContent = "";
  post: Post;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private mode = "create";
  private postId: string;
  private authStatusSub: Subscription;

  constructor(
    public customersService: CustomersService,
    public postsService: PostsService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) {}

lictypes = [
    { value: 'на 30 дней'},
    { value: 'постоянная'}
];

// orgnames = [
//   { value: 'ООО "Рога и Копыта"' },
//   { value: 'АО "Пупкин и сыновья"'},
//   { value: 'Артель "Напрасный труд"' },
//   { value: 'Совхоз "Красный лапоть"'},
// ];

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
//  licControl = new FormControl(this.lictypes[1].viewValue);
//orgNameSelectedValue: string;

customersPerPage: number = 0;
currentPage: number = 0;
customers: Customer[] = [];
userId: string;
totalCustomers = 0;
private customersSub: Subscription;
userIsAuthenticated = false;



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
      email: new FormControl(null, { validators: [Validators.required, Validators.email] }),
      firstname: new FormControl(null, { validators: [Validators.required] }),
      lastname: new FormControl(null, { validators: [Validators.required] }),
      appname: new FormControl(null, { validators: [Validators.required] }),
      appversion: new FormControl(null, { validators: [Validators.required] }),
      licversion: new FormControl(null, { validators: [Validators.required] }),
      hostid: new FormControl(null, { validators: [Validators.required] }),
    });
    this.isLoading = true;
    this.customersService.getCustomers(this.customersPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.customersSub = this.customersService
      .getCustomerUpdateListener()
      .subscribe((customerData: { customers: Customer[]; customerCount: number }) => {
        this.isLoading = false;
        this.totalCustomers = customerData.customerCount;
        this.customers = customerData.customers;
        //console.log(this.customers)
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
    //console.log(this.customersService., )
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("postId")) {
        this.mode = "edit";
        this.postId = paramMap.get("postId");
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          this.post = {
            id: postData._id,
            orgname: postData.orgname,
            email: postData.email,
            firstname: postData.firstname,
            lastname: postData.lastname,
            appname: postData.appname,
            appversion: postData.appversion,
            licversion: postData.licversion,
            gendatetime: postData.gendatetime,
            hostid: postData.hostid,
            creator: postData.creator
          };
          this.form.setValue({
            orgname: this.post.orgname,
            email: this.post.email,
            firstname: this.post.firstname,
            lastname: this.post.lastname,
            appname: this.post.appname,
            appversion: this.post.appversion,
            licversion: this.post.licversion,
            hostid: this.post.hostid,
            //creator: this.post.creator
          });
        });
      } else {
        this.mode = "create";
        this.postId = null;
      }
    });
  }

  onUpdate(orgname: string) {
    for(let customer of this.customers){
      //console.log(customer['orgname']);
       if (customer.orgname == orgname){
        //console.log(customer.email);
        this.form.setValue({
          orgname: customer.orgname,
          email: customer.email,
          firstname: customer.firstname,
          lastname: customer.lastname,
          appname: null,
          appversion: null,
          licversion: null,
          hostid: null
        })
        // this.email = customer.email;
        // this.firstname = customer.firstname;
        // this.lastname = customer.lastname;
        // console.log(this.form)
       }
    }
    
  }

//   private getContentForm() {
//     const formModel = this.form.value;
//     this.selectedCurrency = formModel.currency;

//     return {
//         currency: this.selectedCurrency,
//     // rest removed for readability
//     };
// }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === "create") {
      this.postsService.addPost(
        this.form.value.orgname,
        this.form.value.email,
        this.form.value.firstname,
        this.form.value.lastname,
        this.form.value.appname,
        this.form.value.appversion,
        this.form.value.licversion,
        this.form.value.hostid
      );
    } else {
      this.postsService.updatePost(
        this.postId,
        this.form.value.orgname,
        this.form.value.email,
        this.form.value.firstname,
        this.form.value.lastname,
        this.form.value.appname,
        this.form.value.appversion,
        this.form.value.licversion,
        this.form.value.hostid
      );
    }
    this.form.reset();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
