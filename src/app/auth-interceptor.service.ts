import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEventType,
} from "@angular/common/http";

export class AuthInterceptorService implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const modifiedreq = req.clone({
      headers: req.headers.append("auth", "myheader"),
    });
    console.log("we are in Interceptor");
    return next.handle(modifiedreq);
  }
}
