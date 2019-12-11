import { Component, OnInit } from "@angular/core";
import { Product } from "src/app/models/product.model";
import { NetworkService } from "src/app/services/network.service";

@Component({
  selector: "app-shop-home",
  templateUrl: "./shop-home.component.html",
  styleUrls: ["./shop-home.component.css"]
})
export class ShopHomeComponent implements OnInit {
  mProductArray = new Array<Product>(); // feed จาก network
  mOrderArray = new Array<Product>(); // คำนวนตัง
  mTotalPrice = 0;
  mIsPaymentShow = false; // show เครื่องคิดเลข

  constructor(private networkService: NetworkService) {}

  ngOnInit() {
    this.feedData();
  }

  feedData() {
    this.networkService.getAllProduct().subscribe(
      data => {
        // console.log(JSON.stringify(data.result));

        this.mProductArray = data.result.map(item => {
          var image = item.image;
          if (image != null && image != "") {
            item.image = this.networkService.productImageURL + "/" + item.image;
          }
          return item;
        });
      },
      error => {
        console.log(JSON.stringify(error));
      }
    );
  }

  // Products item Beginม isDecrease ถ้า + ส่ง false, ถ้า - ส่ง true
  onClickAddOrder(item: Product, isDecrease: Boolean) {
    const foundIndex = this.mOrderArray.indexOf(item);

    // -1 คือเอาออก
    if (foundIndex === -1) {
      item.qty = 1; // เซ็ทไอเทมให้มี 1 ชื้น
      this.mOrderArray.unshift(item); // unshift คือ เพิ่ม
    } else {
      // กรณีมีสินค้าใน order
      if (isDecrease) {
        if (item.qty > 1) {
          item.qty--;
        }
      } else {
        item.qty++;
      }
    }
    this.countSumPrice(); // เวลาแอดสินค้า
  }

  countSumPrice() {
    this.mTotalPrice = 0;
    for (const item of this.mOrderArray) {
      this.mTotalPrice += item.price * item.qty;
    }
  }

  // ถ้ามีไอเทม เซ็ท show css
  isSelectedItem(item: Product) {
    return this.mOrderArray.indexOf(item) === -1 ? false : true;
  }
  // Products item End

  // Orders Begin
  onClickRemoveOrder(item: Product) {
    this.mProductArray.map(data => {
      if (item.productId === data.productId) {
        data.qty = null;
      }
    });

    this.mOrderArray.splice(this.mOrderArray.indexOf(item), 1); // indexOf
    this.countSumPrice();

    if (this.mTotalPrice === 0 && this.mIsPaymentShow === true) {
      this.mIsPaymentShow = !this.mIsPaymentShow;
    }
  }

  onClickPayment() {
    if (this.mTotalPrice > 0) {
      this.mIsPaymentShow = !this.mIsPaymentShow;
    } else {
      alert("At least single order is requied!");
    }
  }

  // เมื่อชำระเงินเสร็จ ให้เคลียค่า
  onPaymentCompleted() {
    this.mProductArray = [];
    this.mOrderArray = [];
    this.mTotalPrice = 0;
    this.mIsPaymentShow = false;

    this.feedData();
  }

  printName(event) {
    alert(event);
  }
  // Orders End
}
