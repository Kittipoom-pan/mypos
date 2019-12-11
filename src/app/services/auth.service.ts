import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  constructor(private router: Router) {}

  // check login
  isLogin() {
    return localStorage.getItem(environment.keyLocalAuthenInfo) !== null;
  }

  logOut() {
    //localStorage.removeItem("xxxxxxxx") // เคลียที่ละ key
    localStorage.clear(); // clear all
    this.router.navigate(["/login"]); //router เรียกใช้จาก constructor
  }
}
