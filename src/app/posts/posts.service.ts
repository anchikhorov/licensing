import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
//import { HttpHeaders } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

import { environment } from "../../environments/environment";
import { Post } from "./post.model";
//import { SafeResourceUrl } from '@angular/platform-browser';

const BACKEND_URL = environment.apiUrl + "/posts/";

// let headers = new HttpHeaders({
//    "Content-Type": "text/plain", Accept: "text/plain"  // Auth header
//   //No other headers needed
// });

@Injectable({ providedIn: "root" })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map(postData => {
          return {
            posts: postData.posts.map(post => {
              return {
                id: post._id,
                orgname: post.orgname,
                email: post.email,
                firstname: post.firstname,
                lastname: post.lastname,
                appname: post.appname,
                appversion: post.appversion,
                licversion: post.licversion,
                hostid: post.hostid,
                gendatetime: post.gendatetime,
                expdate: post.expdate,
                creator: post.creator
              };
            }),
            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string;
      orgname: string;
      email: string;
      firstname: string;
      lastname: string;
      appname: string;
      appversion: string;
      licversion: string;
      hostid: string;
      expdate: string;
      gendatetime: string;
      creator: string;
    }>(BACKEND_URL + id);
  }

  getLic(id: string){
    //console.log(BACKEND_URL + id + "/download")
    //BACKEND_URL + id + "/download"
    //return this.http.get(BACKEND_URL + "/download/"+ id , { headers: headers, responseType: 'blob'});
    return this.http.get(BACKEND_URL + "/download/"+ id , { responseType: 'blob'});
  }

  addPost(
    orgname: string,
    email: string,
    firstname: string,
    lastname: string, 
    appname: string, 
    appversion: string, 
    licversion: string,
    hostid: string) {
    const postData = new FormData();
    postData.append("orgname", orgname);
    postData.append("email", email);
    postData.append("firstname", firstname);
    postData.append("lastname", lastname);
    postData.append("appname", appname);
    postData.append("appversion", appversion);
    postData.append("licversion", licversion);
    postData.append("hostid", hostid); 
    this.http
      .post<{ message: string; post: Post }>(
        BACKEND_URL,
        postData
      )
      .subscribe(responseData => {
        console.log(responseData)
        this.router.navigate(["/liclist"]);
      });
  }

  //updatePost(id: string, title: string, content: string, image: File | string) {
  updatePost(
    id: string,
    orgname: string,
    email: string, 
    firstname: string,
    lastname: string,
    appname: string, 
    appversion: string, 
    licversion: string,
    hostid: string
    ) {
    let postData: Post | FormData;
    //if (typeof image === "object") {
    if (typeof "image" === "object") {
      postData = new FormData();
      postData.append("id", id);
      postData.append("orgname", orgname);
      postData.append("email", email);
      postData.append("firsname", firstname);
      postData.append("lastname", lastname);
      postData.append("appname", appname);
      postData.append("appversion", appversion);
      postData.append("licversion", licversion);
      postData.append("hostid", hostid);
      
      //postData.append("creator", creator);
    } else {
      postData = {
        id: id,
        orgname: orgname,
        email: email,
        firstname: firstname,
        lastname: lastname,
        appname: appname,
        appversion: appversion,
        licversion: licversion,
        hostid: hostid,
        gendatetime: null,
        creator: null
      };
    }
    this.http
      .put(BACKEND_URL + id, postData)
      .subscribe(response => {
        this.router.navigate(["/liclist"]);
      });
  }

  deletePost(postId: string) {
    return this.http.delete(BACKEND_URL + postId);
  }
}
