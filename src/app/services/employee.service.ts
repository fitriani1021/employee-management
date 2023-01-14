import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Employee} from "../models/employee";

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http: HttpClient) {
  }

  baseUrl = 'https://63c312dab0c286fbe5f89b7a.mockapi.io/employee';

  postEmployee(data: any) {
    return this.http.post<any>(this.baseUrl, data);
  }

  getEmployees() {
    return this.http.get<Employee[]>(this.baseUrl);
  }

  putEmployee(id: number, data: any) {
    console.log("cek: ", id);
    return this.http.put<any>(this.baseUrl + '/' + id.toString(), data);
  }

  deleteEmployee(id: number) {
    return this.http.delete<any>(this.baseUrl + '/' + id.toString());
  }
}
