import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { Data } from '@angular/router';
import { AccountService, AlertService, DepartmentService } from '@app/_services';
import { FormBuilder, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Department, Request } from '@app/_models';
import { ActivatedRoute, Router } from '@angular/router';

@Component({ templateUrl: 'request.component.html' })
export class RequestComponent implements OnInit {
    departments = null;
    form: FormGroup;
    departmentID: string;
    requestID: string;
    reviewID: string;
    isAddMode: boolean;
    department: Department;
    requests: Request[];
    loading = false;
    submitted = false;
    success = false;
    currentDate = new Date();

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private departmentService: DepartmentService,
        private accountService: AccountService,
        private alertService: AlertService ,

    ) {   }


    ngOnInit() {
        console.log(this.accountService.userValue);
        this.departmentService.getDepartmentById(this.accountService.userValue.department).subscribe(department => {
            this.department = department;
            this.requests = department.requests;
        });


        this.departmentID = this.accountService.userValue.department;
        // this.requestID = this.route.snapshot.params['requestID'];
        this.isAddMode = !this.departmentID;

        // password not required in edit mode
        const passwordValidators = [Validators.minLength(6)];
        if (this.isAddMode) {
            passwordValidators.push(Validators.required);
        }

        this.form = this.formBuilder.group({
            description: ['', Validators.required],
            status: "NEW",
            workType: ['', Validators.required ],
            reason: ['',Validators.required ],
            date: [this.currentDate],
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
        console.log(this.form.value)
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


    setID(requestID, reviewID, status) {
        this.reviewID = reviewID;
        this.requestID = requestID;
        this.updateStatus(status);
    }

    private addReview() {
        this.departmentService.addReview(this.departmentID, this.requestID, this.form.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Request added successfully', { keepAfterRouteChange: true });
                    this.router.navigate(['/request'], { relativeTo: this.route });
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }

    private updateStatus(status: string) {
        this.departmentService.updateStatus(this.departmentID, this.requestID, this.reviewID, status)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Status updated', { keepAfterRouteChange: true });
                    this.router.navigate(['../'], { relativeTo: this.route });
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }



    private addRequest() {
        this.departmentService.addRequest(this.departmentID, this.form.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Request added successfully', { keepAfterRouteChange: true });
                    this.success = true;
                    this.router.navigate(['/requests'], { relativeTo: this.route });
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                    this.success = false;
                }
            });
    }

}

