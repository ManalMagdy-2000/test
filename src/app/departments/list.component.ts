import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService, AlertService, DepartmentService } from '@app/_services';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Role, Department } from '@app/_models';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from '@coreui/angular';
import { User } from '@app/_models';
@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    departments = null;
    supervisors = null;
    form: UntypedFormGroup;
    form2: UntypedFormGroup;
    departmentID: string;
    requestID: string;
    isAddMode: boolean;
    isSupervisor = false;
    department: Department;
    requests: Request[];
    supervisor : User[];
    loading = false;
    submitted = false;


    id: string;
    username: string; //employee ID
    password: string;
    fullname: string;
    email: string;
    role: Role;
    position?: string;
    token: string;
    constructor(
        private formBuilder: UntypedFormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private departmentService: DepartmentService,
        private accountService: AccountService,
        private alertService: AlertService,
        private modal: ModalService
    ) {}


    ngOnInit() {
        this.departmentService.getAllDepartments()
            .pipe(first())
            .subscribe(departments => this.departments = departments);
            this.departmentService.requiredRefresh.subscribe( r => {
              this.departmentService.getAllDepartments()
                .pipe(first())
                .subscribe(departments => this.departments = departments);
            })
        this.accountService.getAll()
            .pipe(first())
            .subscribe(supervisors => this.supervisors = supervisors);

        this.isAddMode = !this.departmentID;

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
            employees: [[]],
            supervisors: [[]]
        });

        console.log(this.departmentID)
        this.form2 = this.formBuilder.group({
            fullname: ['', Validators.required],
            email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
            username: ['', Validators.required],
            password: ['', [Validators.required , Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}') ]],
            position: ['', Validators.required],
            role: [Role.Employee],
            department: [this.departmentID],
            supervisorID : ['' , this.isSupervisor ? Validators.required : ''] ,
            status :"NEW",
            schedules: [[]]
        });


        if (!this.isAddMode) {
            this.departmentService.getDepartmentById(this.departmentID)
                .pipe(first())
                .subscribe(x => this.form.patchValue(x));
        }
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    get f2() { return this.form2.controls; }

    onSubmit() {
        this.submitted = true;
        console.log(this.form)
        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }
        this.loading = true;

            this.createDepartment();
        // } else {
        //     this.updateUser();
        // }

    }

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

        this.form2.patchValue({department: this.departmentID});
        this.createUser();
        // } else {
        //     this.updateUser();
        // }

    }


    setID(departmentID: string) {
        this.departmentID = departmentID;
    }

    private createDepartment() {
        this.departmentService.addDepartment(this.form.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Department added successfully', { keepAfterRouteChange: true });
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }

    private addEmployee() {
        this.departmentService.addEmployee(this.departmentID, this.form2.value)
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

    private createUser() {
        this.accountService.register(this.form2.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Employee added successfully', { keepAfterRouteChange: true });
                    this.addEmployee();
                    this.router.navigate(['../'], { relativeTo: this.route });
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }


}
