/*
   Student Name : Manal Magdy Eid Khalil Eid
   Student ID : B1901825

*/
import { DepartmentService } from '@app/_services';
import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { AccountService, AlertService } from '@app/_services';
import { EmployeeService } from '@app/_services/employee.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Role, User } from '@app/_models';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from '@coreui/angular';

@Component({ templateUrl: 'listsupervisor.component.html' })
export class ListsupervisorComponent implements OnInit {
    employees = null;
    departments = null;
    form: UntypedFormGroup;
    form2: UntypedFormGroup;
    username: string; //employee ID
    requestID: string;
    isAddMode: boolean;
    isSupervisor = false;
    employee: Role.Employee;
    requests: Request[];
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private employeeService: EmployeeService,
        private departmentService : DepartmentService,
        private accountService: AccountService,
        private alertService: AlertService,
        private modal: ModalService
    ) {}


    ngOnInit() {


        this.accountService.getAll()
            .pipe(first())
            .subscribe(employees => this.employees = employees);






        this.isAddMode = !this.username; //employee ID

        // password not required in edit mode
        const passwordValidators = [Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')];
        const emailVal = [ Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')];

        if (this.isAddMode) {
            passwordValidators.push(Validators.required);
        }
        if (this.isAddMode) {
            emailVal.push(Validators.required);
        }


        this.form = this.formBuilder.group({
            name: ['', Validators.required],
            requests: [[]],
            supervisors: [[]]
        });

        console.log(this.username) //employee ID
        this.form2 = this.formBuilder.group({
            fullname: ['', Validators.required],
            email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
            username: ['', Validators.required], //employeee ID
            password: ['', passwordValidators],
            position: ['', Validators.required],
            role: [Role.User], //supervisor
            employee: Role.Employee,
            status :"NEW",
            schedules: [[]],
        });


        if (!this.isAddMode) {
            this.employeeService.getEmployeeById(this.username) //employee ID
                .pipe(first())
                .subscribe(x => this.form.patchValue(x));
        }
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    get f2() { return this.form2.controls; }


    reset(){
      this.isSupervisor = false;
    }

    onSubmit2() {
        this.submitted = true;
        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form2.invalid) {
            return;
        }



        this.loading = true;
        //toggle modal

        this.form2.patchValue({employee: this.username});
        this.createUser(); //create supervisor
        // } else {
        //     this.updateUser();
        // }

    }


    setID(username: string) {
        this.username = username;
    }


    private addSupervisor() {
        this.employeeService.addSupervisor(this.username, this.form2.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    // this.alertService.success('Request added successfully', { keepAfterRouteChange: true });
                    // this.router.navigate(['/departments'], { relativeTo: this.route });
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }
    addSuperEmp() {
      //toggle isResource
      if(this.isSupervisor) {
          this.isSupervisor = false;
      }
      else {
          this.isSupervisor = true;
      }
    }

    private createUser() { //create supervisor
        this.accountService.register(this.form2.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('supervisor  added successfully', { keepAfterRouteChange: true });
                    this.addSupervisor();
                    this.router.navigate(['../'], { relativeTo: this.route });
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }
}
