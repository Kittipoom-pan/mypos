import { NetworkService } from "./../../../services/network.service";
import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Location } from "@angular/common";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"]
})
export class RegisterComponent implements OnInit {
  position = ["Cashier", "Admin"];

  // DI ฉีด NetworkService เข้ามาใช้ติดต่อ network
  constructor(
    private location: Location,
    private networkService: NetworkService
  ) {}

  ngOnInit() {}

  register(form: NgForm) {
    this.networkService.register(form.value).subscribe(data => {
      this.location.back();
    });
  }

  checkConfirmPassword(form: NgForm) {
    return (
      form.value.password !== form.value.comfirm_password &&
      form.value.comfirm_password !== ""
    );
  }

  cancel() {
    this.location.back();
  }
}
