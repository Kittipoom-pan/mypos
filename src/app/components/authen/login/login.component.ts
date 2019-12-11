import { NetworkService } from "./../../../services/network.service";
import { Component, OnInit } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  // DI ฉีด
  constructor(
    private router: Router,
    private networkService: NetworkService,
    private authservice: AuthService // เอามาจากหน้า auth.service
  ) {} // object Router

  ngOnInit() {
    if (this.authservice.isLogin()) {
      this.router.navigate(["/stock"]);
    }
  }

  login(form: NgForm) {
    // alert(JSON.stringify(form.value))
    this.networkService.login(form.value).subscribe(data => {
      // เช็ค token
      if (data.token != "") {
        // เก็บค่า token ไว้ใน localstorage
        localStorage.setItem(environment.keyLocalAuthenInfo, data.token);
        this.router.navigate(["/stock"]); // function navigate
      } else {
        alert(data.message);
      }
    });
  }
}
