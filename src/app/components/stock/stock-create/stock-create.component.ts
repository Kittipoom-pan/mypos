import { Component, OnInit } from "@angular/core";
import { Product } from "src/app/models/product.model";
import { NetworkService } from "src/app/services/network.service";
import { Location } from "@angular/common";

@Component({
  selector: "app-stock-create",
  templateUrl: "./stock-create.component.html",
  styleUrls: ["./stock-create.component.css"]
})
export class StockCreateComponent implements OnInit {
  mProduct = new Product(); // ยังไม่มีค่า
  imageSrc: String | ArrayBuffer = null // ประกาศ 2 type

  constructor(
    private location: Location,
    private networkService: NetworkService
  ) {}

  ngOnInit() {
    // set ค่า default เป็น 0
    this.mProduct.stock = 0;
    this.mProduct.price = 0;
  }

  // ยิงขึ้น service create
  submit() {
    this.networkService.newProduct(this.mProduct).subscribe(
      data => this.location.back(), //  ใช้ sweet alert บอกว่า success
      error => alert(JSON.stringify(error))
    );
  }

  cancel() {
    this.location.back();
  }

  // preview รูป
  onUploadImage(event) {
    const metaImage = event.target.files[0];
    if (metaImage) {
      const reader = new FileReader();
      reader.readAsDataURL(metaImage);
      // callback
      reader.onload = () => {
        this.imageSrc = reader.result; // preview รูปภาพ
        this.mProduct.image = metaImage; // เก็บ object รูปใน database
      };
    }
  }
}
