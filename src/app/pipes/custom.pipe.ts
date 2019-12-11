import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "custom"
})
export class CustomPipe implements PipeTransform {
  // input
  // {{ 0.00 | custom}} => ฿x.xx custom คือ ชื่อ pipe ใช้สำหรับเปลี่ยนแปลงค่า
  transform(value: String, ...args: any[]): any {
    return (
      "฿" +
      value
        .replace(/,/g, "")
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    ); // output
  }
}
