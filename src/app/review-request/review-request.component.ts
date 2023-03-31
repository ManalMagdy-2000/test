/*
   Student Name : Manal Magdy Eid Khalil Eid
   Student ID : B1901825

*/
import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService, AlertService, DepartmentService } from '@app/_services';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Department, User } from '@app/_models';
import { ActivatedRoute, Router } from '@angular/router';

@Component({ templateUrl: 'review-request.component.html' })
export class ReviewRequestComponent implements OnInit {
    departments = null;
    form: UntypedFormGroup;
    departmentID: string;
    requestID: string;
    isAddMode: boolean;
    department: Department;
    requests: Request[];
    loading = false;
    requestsCount: number;
    countNewReq: number;
    submitted = false;
    user: User;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private departmentService: DepartmentService,
        private accountService: AccountService,
        private alertService: AlertService
    ) {}


    ngOnInit() {
        this.departmentService.getAllDepartments()
            .pipe(first())
            .subscribe(departments => this.departments = departments);

        this.user = this.accountService.userValue;


        // this.departmentID = this.route.snapshot.params['departmentID'];
        // this.requestID = this.route.snapshot.params['requestID'];
        this.isAddMode = !this.departmentID;

        // password not required in edit mode
        const passwordValidators = [Validators.minLength(6)];
        if (this.isAddMode) {
            passwordValidators.push(Validators.required);
        }

        this.form = this.formBuilder.group({
            remarks: ['', Validators.required],
            user: this.accountService.userValue, //supervisor
            request: [this.requestID]
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
        console.log(this.form)
        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }



        this.loading = true;

            this.addReview();
        // } else {
        //     this.updateUser();
        // }

    }

    countRequests() {
        let count = 0;
        for(let i = 0; i < this.departments.length; i++) {
            for(let j = 0; j < this.departments[i].requests.length; j++) {
                if(this.departments[i].requests[j].status != "CLOSED") {
                    count++;
                }
            }
        }
        return count;
    }

    countPastRequests() {
        let count = 0;
        for(let i = 0; i < this.departments.length; i++) {
            for(let j = 0; j < this.departments[i].requests.length; j++) {
                if(this.departments[i].requests[j].status == "CLOSED") {
                    count++;
                }
            }
        }
        return count;
    }

    //get number of requests for department with status NEW
    countNewRequests(departmentID) {
        let count = 0;
        for(let i = 0; i < this.departments.length; i++) {
            if(this.departments[i].departmentID == departmentID) {
                for(let j = 0; j < this.departments[i].requests.length; j++) {
                    if(this.departments[i].requests[j].status == "NEW") {
                        count++;
                    }
                }
            }
        }
        console.log(count);
        return count;
    }

    //get number of requests for department with status CLOSED
    countClosedRequests(departmentID) {
        let count = 0;
        for(let i = 0; i < this.departments.length; i++) {
            if(this.departments[i].departmentID == departmentID) {
                for(let j = 0; j < this.departments[i].requests.length; j++) {
                    if(this.departments[i].requests[j].status == "CLOSED") {
                        count++;
                    }
                }
            }
        }
        console.log(count);
        return count;
    }


    setID(departmentID, requestID) {
        if(this.user) {
            this.departmentID = departmentID;
            this.requestID = requestID;
        }
        else {
            //redirect to login
            this.router.navigate(['/account/login']);
        }
    }

    private addReview() {
        this.departmentService.addReview(this.departmentID, this.requestID, this.form.value)
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
