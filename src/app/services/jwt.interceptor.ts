import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse
} from "@angular/common/http";
import { Observable } from "rxjs";
import "rxjs/add/operator/do";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root"
})
export class JwtInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // : Observable<HttpEvent<any> ต้อง return ออกมา
    // todo

    // เก็บ JWT แบบไม่ใช่สตริง
    const jwtToken = localStorage.getItem(environment.keyLocalAuthenInfo);
    // ส่ง token ไป
    if (jwtToken != null) {
      const cloned = req.clone({
        headers: req.headers.set("Authorization", "bearer " + jwtToken)
      });

      // simple way
      // return next.handle(cloned); // ส่ง header ไป

      // Intercept response too
      // npm i rxjs-compat
      return next.handle(cloned).do(
        // any คือ type
        (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            // do stuff with response if you want
          }
        },
        // ขากลับ 500 status error
        (err: any) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 403 || err.status === 500) {
              // redirect to the login route or show a modal 'Token is not valid'
              //localStorage.setItem(environment.keyLocalAuthenInfo, null);
              //this.router.navigate(['/login']);
            }
          }
        }
      );
    } else {
      return next.handle(req);
    }
  }
  constructor() {}
}
