import { Component, OnInit, OnDestroy } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Post } from "./post.model";
import { PostService } from "./posts.service";
import { Subscription } from "rxjs";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit, OnDestroy {
  loadedPosts: Post[] = [];
  isFetching: boolean = false;
  error: string;
  errorSub: Subscription;
  constructor(private http: HttpClient, private postService: PostService) {}

  ngOnInit() {
    this.isFetching = true;
    this.errorSub = this.postService.error.subscribe((error) => {
      this.error = error;
    });
    this.postService.fetchPost().subscribe(
      (data) => {
        this.isFetching = false;
        this.loadedPosts.push(...data);
      },
      (error) => {
        this.isFetching = false;
        this.error = error.message;
      }
    );
  }

  ngOnDestroy() {
    this.errorSub.unsubscribe();
  }
  onCreatePost(postData: Post) {
    this.postService.createPost(postData.title, postData.content);
  }

  onFetchPosts() {
    this.isFetching = true;
    this.postService.fetchPost().subscribe((data) => {
      this.isFetching = false;
      this.loadedPosts.push(...data);
    });
  }
  onClear() {
    this.error = null;
  }
  onClearPosts() {
    // Send Http request
    this.isFetching = true;
    this.postService.ClearPost().subscribe(
      (data) => {
        this.loadedPosts = [];
        this.isFetching = false;
      },
      (error) => {
        console.log(error.message);
        this.isFetching = false;
        this.error = error.message;
      }
    );
  }

  // fetchPosts() {
  //   this.isFetching = true;
  //   this.http
  //     .get<{ [key: string]: Post }>(
  //       "https://angularproj-1993.firebaseio.com/post.json"
  //     )
  //     .pipe(
  //       map((responseData) => {
  //         var resArray: Post[] = [];
  //         for (var key in responseData) {
  //           if (responseData.hasOwnProperty(key))
  //             resArray.push({ ...responseData[key], id: key });
  //         }
  //         return resArray;
  //       })
  //     )
  //     .subscribe((data) => {
  //       this.isFetching = false;
  //       this.loadedPosts.push(...data);
  //     });
  // }
}
