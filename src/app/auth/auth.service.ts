import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Subject } from "rxjs";

import { environment } from "../../environments/environment";
import { AuthData } from "./auth-data.model";
// import { RoleData } from "./role-data.model";

const BACKEND_URL = "api/user/"//environment.apiUrl + "/user/";

@Injectable({ providedIn: "root" })
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private userId: string;
  private authStatusListener = new Subject<boolean>();
  private isAdminPresent: boolean = false;
  private role = '';
  private email = '';

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getIsAdminPresent() {
    return this.isAdminPresent;
  }

  getUserId() {
    return this.userId;
  }

  getUserRole(){
    return this.role;
  }

  getUserEmail(){
    return this.email;
  }

  getAuthStatusListener() {
    //console.log("this.role", this.role)
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string, admin: boolean) {
    const authData: AuthData = { email: email, password: password, admin: admin };
    this.http.post(BACKEND_URL + "/signup", authData).subscribe(
      () => {
        this.isAdminPresent = true;
        //this.router.navigate(["/auth/login"]);
        
      },
      error => {
        //console.log("error", error)
        this.authStatusListener.next(true);
      }
    );
  }



  reset(email: string, password?: string, admin?: boolean) {
    const authData: AuthData = { email: email, password: password, admin: admin };
    this.http.post(BACKEND_URL + "/reset", authData).subscribe(
      () => {
        this.router.navigate(["/auth/login"]);
      },
      error => {
        this.authStatusListener.next(false);
      }
    );
  }

  change(email: string, password?: string, admin?: string) {
    //const authData: AuthData = { email: email, password: password  };
    const userData = {id: this.userId, password: password}
    //console.log(this.userId)
    this.http.post(BACKEND_URL + "/change", userData ).subscribe(
      () => {
        this.logout()
        this.router.navigate(["/auth/login"]);
      },
      error => {
        this.authStatusListener.next(false);
      }
    );
  }

  login(email: string, password: string, admin?: boolean) {
    const authData: AuthData = { email: email, password: password, admin: admin };
    this.http
      .post<{ token: string; expiresIn: number; userId: string; role: string, email: string }>(
        BACKEND_URL + "/login",
        authData
      )
      .subscribe(
        response => {
          const token = response.token;
          this.token = token;
          if (token) {
            const expiresInDuration = response.expiresIn;
            this.setAuthTimer(expiresInDuration);
            this.isAuthenticated = true;
            this.userId = response.userId;
            this.role = response.role
            this.email = response.email
            //console.log("this.role",this.role)
            this.authStatusListener.next(true);
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            );
            //console.log(expirationDate);
            this.saveAuthData(token, expirationDate, this.userId, this.role, this.email);
            this.router.navigate(["/liclist"]);
          }
        },
        error => {
          this.authStatusListener.next(false);
        }
      );
  }

  checkAdminPresent(admin: boolean, email?: string, password?: string) {
    const authData: AuthData = { email: email, password: password, admin: admin };
    //const roleData: RoleData = { role: role };
    this.http.post(BACKEND_URL + "/checkrole", authData).subscribe(
      response => {       
          this.isAdminPresent = response['status']
        if (!this.isAdminPresent) {
          this.router.navigate(["/auth/signup"])
        }
      },
      error => {
        //console.log("error", error)
        this.authStatusListener.next(false);
      }
    );
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation ) {
      this.router.navigate(["/auth/login"])
      return;
     } 
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.role = authInformation.role;
      this.email = authInformation.email;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
      this.router.navigate(["/liclist"]);
    } else {
      this.router.navigate(["/auth/login"])
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = null;
    this.role = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(["/auth/login"]);
  }

  private setAuthTimer(duration: number) {
    console.log("Setting timer: " + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string, role: string, email: string) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
    localStorage.setItem("userId", userId);
    localStorage.setItem("role", role);
    localStorage.setItem("email", email);
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");
    const role = localStorage.getItem("role");
    const email = localStorage.getItem("email");
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId,
      role: role,
      email: email
    };
  }
}
