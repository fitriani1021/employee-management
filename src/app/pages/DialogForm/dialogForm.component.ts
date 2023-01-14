import {Component, Inject, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {MatDialogRef, MAT_DIALOG_DATA} from "@angular/material/dialog";
import {Group} from "../../models/group";
import Swal from "sweetalert2";
import {EmployeeService} from "../../services/employee.service";
import {GroupService} from "../../services/group.service";

@Component({
  selector: 'app-dialog-form',
  templateUrl: './dialogForm.component.html',
  styleUrls: ['./dialogForm.component.css']
})
export class DialogFormComponent implements OnInit {
  statusList = ["Active", "Non Active"];
  employeeForm!: FormGroup;
  actionBtn: string = "Save";
  maxDate = new Date();
  groupList!: Group[];
  isLoading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    private dialogRef: MatDialogRef<DialogFormComponent>,
    private groupService: GroupService,
    @Inject(MAT_DIALOG_DATA) public editData: any
  ) {
  }

  ngOnInit(): void {
    this.employeeForm = this.formBuilder.group({
      username: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      birthDate: ['', Validators.required],
      basicSalary: [null, Validators.required],
      status: ['', Validators.required],
      group: ['', Validators.required],
      description: ['', Validators.required]
    });

    if (this.editData) {
      this.actionBtn = "Update";
      this.employeeForm.controls['username'].setValue(this.editData.username);
      this.employeeForm.controls['firstName'].setValue(this.editData.firstName);
      this.employeeForm.controls['lastName'].setValue(this.editData.lastName);
      this.employeeForm.controls['email'].setValue(this.editData.email);
      this.employeeForm.controls['birthDate'].setValue(this.editData.birthDate);
      this.employeeForm.controls['basicSalary'].setValue(this.editData.basicSalary);
      this.employeeForm.controls['status'].setValue(this.editData.status);
      this.employeeForm.controls['group'].setValue(this.editData.group);
      this.employeeForm.controls['description'].setValue(this.editData.description);
    }

    this.onGetAllGroup();
  }

  onGetErrorMessage() {
    return this.employeeForm.controls['email'].status == 'INVALID' ? 'Not a valid email' : '';
  }

  onGetAllGroup() {
    this.groupService.getGroup().subscribe((value) => {
      this.groupList = value;
    });
  }

  onAddEmployee() {
    if (!this.editData) {
      this.onGetErrorMessage()
      if (this.employeeForm.valid) {
        this.isLoading = true;
        this.employeeService.postEmployee(this.employeeForm.value)
          .subscribe({
            next: (value) => {
              this.isLoading = false;
              Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Employee added successfully',
              })
              this.employeeForm.reset();
              this.dialogRef.close('save');
            },
            error: () => {
              this.isLoading = false;
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Error while adding the employee',
              })
            }
          });
      }
    } else {
      this.onUpdateEmployee();
    }
  }

  onUpdateEmployee() {
    this.isLoading = true;
    this.employeeService.putEmployee(this.editData.id, this.employeeForm.value)
      .subscribe({
        next: (value) => {
          this.isLoading = false;
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Employee update successfully',
          })
          this.employeeForm.reset();
          this.dialogRef.close('update');
        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error while updating the record',
          })
          this.isLoading = false;
        }
      })
  }
}
