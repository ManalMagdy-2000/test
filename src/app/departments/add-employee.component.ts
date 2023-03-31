/*
   Student Name : Manal Magdy Eid Khalil Eid
   Student ID : B1901825

*/
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { DepartmentService, AlertService, AccountService } from '@app/_services';
import { Role, Department } from '@app/_models';

@Component({ templateUrl: 'add-Employee.component.html' })
export class  AddEmployeeComponent implements OnInit {
    form: UntypedFormGroup;
    departmentID: string;
    isAddMode: boolean;
    department: Department;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private departmentService: DepartmentService,
        private accountService: AccountService,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        this.departmentID = this.route.snapshot.params['id'];
        this.isAddMode = !this.departmentID;

        // password not required in edit mode
        const passwordValidators = [Validators.pattern('(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}')];
        const emailVal = [ Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')];


        if (this.isAddMode) {
            passwordValidators.push(Validators.required);
        }
        if (this.isAddMode) {
            emailVal.push(Validators.required);
        }


        this.form = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            username: ['', Validators.required],
            password: ['', passwordValidators],
            role: [Role.Employee],
            department: [this.departmentID],
            schedules: [[]],
        });

        if (!this.isAddMode) {
            this.departmentService.getDepartmentById(this.departmentID)
                .pipe(first())
                .subscribe(x => this.form.patchValue(x));
        }
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;

            this.createUser();
        // } else {
        //     this.updateUser();
        // }

    }

    private addEmployee() {
        this.departmentService.addEmployee(this.departmentID, this.form.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Request added successfully', { keepAfterRouteChange: true });
                    this.router.navigate(['/departments'], { relativeTo: this.route });
                    window.location.reload();

                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }

    private createUser() {
        this.accountService.register(this.form.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('User added successfully', { keepAfterRouteChange: true });
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

