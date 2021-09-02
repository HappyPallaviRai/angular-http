import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpEventType,
} from "@angular/common/http";
import { Post } from "./post.model";
import { map, catchError, tap } from "rxjs/operators";
import { Subject, throwError } from "rxjs";

@Injectable({ providedIn: "root" })
export class PostService {
  constructor(private http: HttpClient) {}
  error = new Subject<string>();
  createPost(title: string, content: string) {
    var postData: Post = { title: title, content: content };
    this.http
      .post<{ name: string }>(
        "https://angularproj-1993.firebaseio.com/post.json",
        postData,
        {
          observe: "response",
        }
      )
      .subscribe(
        (data) => {
          console.log(data);
        },
        (error) => {
          this.error.next(error.message);
        }
      );
  }

  fetchPost() {
    let param = new HttpParams();
    param = param.append("print", "pretty");
    param = param.append("custom", "key");
    return this.http
      .get<{ [key: string]: Post }>(
        "https://angularproj-1993.firebaseio.com/post.json",
        {
          headers: new HttpHeaders({ "custome-header": "hello" }),
          params: param,
          responseType: "json",
        }
      )
      .pipe(
        map((responseData) => {
          var resArray: Post[] = [];
          for (var key in responseData) {
            if (responseData.hasOwnProperty(key))
              resArray.push({ ...responseData[key], id: key });
          }
          return resArray;
        }),
        catchError((errorResp) => {
          // make entry in analytics server
          return throwError(errorResp);
        })
      );
  }

  ClearPost() {
    return this.http
      .delete("https://angularproj-1993.firebaseio.com/post.json", {
        observe: "events",
      })
      .pipe(
        tap((event) => {
          console.log(event);
          if (event.type === HttpEventType.Sent) {
            //...do something on sent
          }
          if (event.type === HttpEventType.Response)
            console.log("response " + event.body);
        })
      );
  }
}
