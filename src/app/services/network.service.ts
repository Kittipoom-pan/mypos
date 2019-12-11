import {
  ProductResponse as RegisterResponse,
  ProductAllResponse,
  Product,
  ProductResponse
} from "./../models/product.model";
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { LoginResponse } from "../models/user.model";
import { environment } from "src/environments/environment";

// injectable ทั้งคลาสเป็นระดับ service
@Injectable({
  providedIn: "root" // ไม่ต้องไปประกาศใน app.module
})
export class NetworkService {
  [x: string]: any;
  add(value: any) {
    throw new Error("Method not implemented.");
  }
  private headers = new HttpHeaders({ "Content-Type": "application/json" });
  private hostURL = environment.baseAPIURL; //https://localhost:5001
  private apiURL = `${this.hostURL}`;
  // -----------------------------------------------------
  private loginURL = `${this.apiURL}/auth/login`;
  private registerURL = `${this.apiURL}/auth/register`;
  private productURL = `${this.apiURL}/product`;
  public productImageURL = `${this.apiURL}/product/images`;
  private outOfStockURL = `${this.productURL}/count/out_of_stock`;
  private transactionURL = `${this.apiURL}/transaction`;

  constructor(private httpClient: HttpClient) {}

  // ยิง api
  register(data): Observable<RegisterResponse> {
    return this.httpClient.post<RegisterResponse>(this.registerURL, data); // "http://192.168.0.102:5000/api/auth/register"
  }

  login(data): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>(this.loginURL, data);
  }

  //คลิกขวาสิ่งที่อยากรู้ เลือก Peek Reference หรือ Find all
  getAllProduct(): Observable<ProductAllResponse> {
    return this.httpClient.get<ProductAllResponse>(this.productURL);
  }

  // โยน id เข้่ามา
  getProduct(id: number): Observable<ProductResponse> {
    return this.httpClient.get<ProductResponse>(`${this.productURL}/${id}`); // ไป get id มา
  }

  deleteProduct(id: number): Observable<ProductAllResponse> {
    return this.httpClient.delete<ProductAllResponse>(
      `${this.productURL}/${id}`
    );
  }

  newProduct(data: Product): Observable<ProductAllResponse> {
    return this.httpClient.post<ProductAllResponse>(
      this.productURL,
      this.makeFormData(data)
    ); // data ส่งแบบ json
  }

  // put ขึิ้นอยู่กับ api
  editProduct(data: Product, id: number): Observable<ProductResponse> {
    return this.httpClient.put<ProductResponse>(
      `${this.productURL}/${id}`,
      this.makeFormData(data)
    );
  }
  // ส่งแบบ formdata
  makeFormData(product: Product): FormData {
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("price", `${product.price}`);
    formData.append("stock", `${product.stock}`);
    formData.append("upload_file", product.image);
    return formData;
  }
}
