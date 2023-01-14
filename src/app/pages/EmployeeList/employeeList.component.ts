import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {EmployeeService} from "../../services/employee.service";
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {AuthGuard} from "../../shared/guard/auth.guard";
import Swal from "sweetalert2";
import {DialogFormComponent} from "../DialogForm/dialogForm.component";

@Component({
  selector: 'app-dashboard',
  templateUrl: './employeeList.component.html',
  styleUrls: ['./employeeList.component.css']
})
export class EmployeeListComponent implements OnInit {
  title: string = "Employee Management";
  displayedColumns: string[] = ['username', 'firstName', 'email', 'group', 'status', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    public dialog: MatDialog,
    private employeeService: EmployeeService,
    private readonly authService: AuthService,
    private readonly router: Router,
    private authGuard: AuthGuard
  ) {
  }

  ngOnInit(): void {
    this.onGetALlEmployees();
  }

  onOpenDialog() {
    this.dialog.open(DialogFormComponent, {
      width: '40%'
    })
      .afterClosed().subscribe(value => {
      if (value === 'save') {
        this.onGetALlEmployees();
      }
    });
  }

  onGetALlEmployees() {
    this.employeeService.getEmployees()
      .subscribe({
        next: (value) => {
          this.dataSource = new MatTableDataSource(value);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error while fetching the Records',
          })
        }
      })
  }

  onApplyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onEditEmployee(row: any) {
    this.dialog.open(DialogFormComponent, {
      width: '40%',
      data: row
    })
      .afterClosed().subscribe(value => {
      if (value === 'update') {
        this.onGetALlEmployees();
      }
    })
  }

  onDeleteEmployee(id: number) {
    Swal.fire({
      title: 'Are you sure want to delete?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        this.employeeService.deleteEmployee(id)
          .subscribe({
            next: (res) => {
              Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Successfully deleted employee',
              })
              this.onGetALlEmployees();
            },
            error: () => {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Error while deleting employee',
              })
            }
          })
      }
    })
  }

  onDetailEmployee(row: any) {
    this.router.navigate(['employee-detail'], {state: row});
  }

  onLogout() {
    this.authService.logout();
  }
}
