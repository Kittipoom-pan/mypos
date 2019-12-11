import { Component, OnInit } from "@angular/core";
import { Product } from "src/app/models/product.model";
import { NetworkService } from "src/app/services/network.service";
import { Location } from "@angular/common";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-stock-edit",
  templateUrl: "./stock-edit.component.html",
  styleUrls: ["./stock-edit.component.css"]
})
export class StockEditComponent implements OnInit {
  mProduct: Product = null; // ประกาศ type เป็น Product
  imageSrc: String | ArrayBuffer = null; // ประกาศ 2 type

  constructor(
    // ActivatedRoute ดักจับ parameter
    private activateRoute: ActivatedRoute,
    private location: Location,
    private networkService: NetworkService
  ) {}

  ngOnInit() {
    // ดักจับ parameter
    this.activateRoute.params.subscribe(
      // ส่งตัวแปรกลับมา
      params => {
        // id มาจาก app-routing.module.ts : stock/edit/:id
        this.feedData(params.id);
      }
    );
  }

  feedData(id: number) {
    this.networkService.getProduct(id).subscribe(data => {
      data.result.image = `${this.networkService.productImageURL}/${data.result.image}`;
      this.mProduct = data.result;
    });
  }

  // ยิงขึ้น service create
  submit() {
    this.networkService
      // backend รับ 2 ค่า เลยต้องส่งทั้ง this.mProduct, this.mProduct.productId
      .editProduct(this.mProduct, this.mProduct.productId)
      .subscribe(
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
