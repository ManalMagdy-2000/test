import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService, ScheduleService } from '@app/_services';

@Component({ templateUrl: 'schedule-review.component.html' })
export class ScheduleReviewComponent implements OnInit {
    form: UntypedFormGroup;
    form2: UntypedFormGroup;
    id: string;
    isAddMode: boolean;
    isEmployee: boolean;
    isSupervisor:boolean;
    loading = false;
    submitted = false;
    departments = [];
    schedules = [];
    selectedSchedule = null;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private scheduleService: ScheduleService,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.isAddMode = !this.id;
        this.isEmployee = this.accountService.userValue.role === 'Employee';
        this.isSupervisor = this.accountService.userValue.role === 'User';
        this.scheduleService.getAllSchedules().pipe(first())
        .subscribe(x => this.schedules = x);


        // password not required in edit mode
        const passwordValidators = [Validators.pattern('(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}')];
        const emailVal = [ Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')];

        if (this.isAddMode) {
            passwordValidators.push(Validators.required);
        }
        if (this.isAddMode) {
            emailVal.push(Validators.required);
        }

        if(this.isEmployee) {
            this.form = this.formBuilder.group({
                workHours: ['', Validators.required],
                workLocation: ['', Validators.required],
                workReport: ['', Validators.required],
            });
            this.form2 = this.formBuilder.group({
                date: ['', Validators.required],
            });
        }
        else {
            this.form = this.formBuilder.group({
                workHours: ['', Validators.required],
                workLocation: ['', Validators.required],
                workReport: ['', Validators.required],

            });

            this.form2 = this.formBuilder.group({
                date: ['', Validators.required],
            });
        }
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }
    get f2() { return this.form2.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.form.value.date = this.form2.value.date;
        this.form.value.supervisorComments = "";

        console.log(this.form.value);
        this.loading = true;
        this.addSchedule();
    }

    checkDate() {
        if (this.form2.invalid) {
            console.log("invalid");
            return;
        }
        this.selectedSchedule = this.form2.value.date
        this.schedules = []
        this.scheduleService.getAllSchedules().pipe(first())
        .subscribe(x => this.schedules = x);

        // this.selectedSchedule.push(this.schedules.find(x => x.date === this.form2.value.date));
       
    }


    private addSchedule() {
        this.scheduleService.addSchedule(this.form.value, this.id)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('User added successfully', { keepAfterRouteChange: true });
                    this.router.navigate(['../'], { relativeTo: this.route });
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }

    private updateUser() {
        this.accountService.update(this.id, this.form.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Update successful', { keepAfterRouteChange: true });
                    this.router.navigate(['../'], { relativeTo: this.route });
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }
}
