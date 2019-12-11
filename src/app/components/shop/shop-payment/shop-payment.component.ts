import { NetworkService } from "src/app/services/network.service";
import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-shop-payment",
  templateUrl: "./shop-payment.component.html",
  styleUrls: ["./shop-payment.component.css"]
})
export class ShopPaymentComponent {
  //  ประกาศตัวแปร totalPayment  @Input("total") เป็นชื่อของ totalPayment
  @Input("total") totalPayment: number;
  @Input("order") orderPayment: string;
  //  Emit ยิงจรวดไปหาตัว แม่
  @Output("submit_success") submitPayment = new EventEmitter<void>(); // assign ค่าให้, type void
  @Output("msg") msgPayment = new EventEmitter<string>(); // assign ค่าให้, type void

  givenNumber = "0.00";

  constructor(private NetworkService: NetworkService) {}

  // mChange คือ ตัวแปร ไม่ใช่ function
  public get mChange(): number {
    const cash = Number(this.givenNumber.replace(/,/g, ""));
    const result = cash - this.totalPayment;
    if (result >= 0) {
      return result;
    } else {
      return 0;
    }
  }

  // ชำระเงินพอดี
  public get isPaidEnough() {
    var given = Number(this.givenNumber);
    if (given > 0 && given >= this.totalPayment) {
      return true;
    }
    return false;
  }

  onClickExact() {
    this.givenNumber = String(this.totalPayment);
  }

  onClickGiven(addGiven: number) {
    this.givenNumber = String(Number(this.givenNumber) + addGiven + ".00");
  }

  onClickReset() {
    this.givenNumber = "0.00";
  }

  onClickSubmit() {
    // ส่งค่ากลับไป
    this.submitPayment.emit();
    this.msgPayment.emit("success");
  }
}
