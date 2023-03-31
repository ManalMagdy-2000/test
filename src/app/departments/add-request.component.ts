/*
   Student Name : Manal Magdy Eid Khalil Eid
   Student ID : B1901825

*/
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { DepartmentService, AlertService, AccountService } from '@app/_services';

@Component({ templateUrl: 'add-request.component.html' })
export class AddRequestComponent implements OnInit {
    form: UntypedFormGroup;
    departmentID: string;
    isAddMode: boolean;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private departmentService: DepartmentService,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        this.departmentID = this.route.snapshot.params['id'];
        this.isAddMode = !this.departmentID;
        console.log(this.isAddMode);

        // password not required in edit mode
        const passwordValidators = [Validators.minLength(6)];
        if (this.isAddMode) {
            passwordValidators.push(Validators.required);
        }

        this.form = this.formBuilder.group({
            description: ['', Validators.required],
            date: ['', Validators.required],
            time: ['', Validators.required],
            reviews: [[]]
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

            this.addRequest();
        // } else {
        //     this.updateUser();
        // }

    }

    private addRequest() {
        this.departmentService.addRequest(this.departmentID, this.form.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Request added successfully', { keepAfterRouteChange: true });
                    this.router.navigate(['../'], { relativeTo: this.route });
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }
}
