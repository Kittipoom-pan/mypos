import { NetworkService } from "./../../../services/network.service";
import { Component, OnInit } from "@angular/core";
import Swal from "sweetalert2";
import { Product } from "src/app/models/product.model";
import { Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { RouterLink, Router } from "@angular/router";

@Component({
  selector: "app-stock-home",
  templateUrl: "./stock-home.component.html",
  styleUrls: ["./stock-home.component.css"]
})
export class StockHomeComponent implements OnInit {
  mDataArray: Product[]; //ตัวแสดงผล
  mSearchProductArray: Product[]; // ตัว search
  // สร้างตัวแปรมาดักรอ
  searchTextChanged = new Subject<string>();

  constructor(private networkService: NetworkService, private router: Router) {}

  ngOnInit() {
    this.feedData();
    // Search
    this.searchTextChanged
      // หน่วงไว้ 1 วิ
      .pipe(debounceTime(1000))
      .subscribe(term => this.onSearch(term)); // term มาจาก <string>
  }

  onSearch(keyword: string) {
    // ถ้าไม่มีการ search ให้ feedData ใหม่
    if (keyword === "") {
      this.feedData();
    } else {
      // จะทำ search api ก็ได้
      // search แบบ local
      this.mDataArray = this.mSearchProductArray.filter(product => {
        // ตัวนี้ product.name.toLowerCase() == ตัวนี้ (keyword.toLowerCase()) หรือป่าว
        return product.name.toLowerCase().indexOf(keyword.toLowerCase()) > -1;
      });
    }
  }

  // callback
  feedData() {
    this.networkService.getAllProduct().subscribe(
      // เอาสินค้าไปโชว์
      // map เปลี่ยนแปลง
      data => {
        //alert(JSON.stringify(data));
        console.log(data.result);

        this.mDataArray = data.result.map(product => {
          product.image =
            this.networkService.productImageURL + "/" + product.image; // ต่อ path + / + ที่ด้านหน้า image
          return product;
        });
        // search ข้อมูล ไปเก็บไว้ใน mDataArray
        this.mSearchProductArray = this.mDataArray;
      },
      // error คือ ตัวแปร
      error => {
        alert(JSON.stringify(error));
      }
    );
  }

  // return เป็นตัวเลข
  getOutOfStock(): number {
    return this.mDataArray.filter(product => {
      if (product.stock <= 0) {
        return product;
      }
    }).length;
  }

  editProduct(id: number) {
    // `` ไม่ต่อสตริง
    this.router.navigate([`stock/edit/${id}`]);
  }

  deleteProduct(id: number) {
    // form swal
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(result => {
      if (result.value) {
        this.networkService.deleteProduct(id).subscribe(
          // data คือ ตัวแปร
          data => {
            Swal.fire("Deleted!", "Your file has been deleted.", "success");

            this.feedData();
          },
          // error คือ ตัวแปร
          error => {
            alert(JSON.stringify(error));
          }
        );
      }
    });
  }
}
