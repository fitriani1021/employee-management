import {Component} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employeeDetail.component.html',
  styleUrls: ['./employeeDetail.component.css']
})
export class EmployeeDetailComponent {
  titleCard: string = "Employee Detail"
  data: any = this.router.getCurrentNavigation()?.extras.state;

  constructor(private router: Router) {
  }
}
