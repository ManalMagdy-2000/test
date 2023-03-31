/*
   Student Name : Manal Magdy Eid Khalil Eid
   Student ID : B1901825

*/
import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { AccountService, AlertService, DepartmentService } from '@app/_services';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Role } from '@app/_models';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-supervisors',
  templateUrl: './supervisors.component.html',
  styleUrls: ['./supervisors.component.scss']
})
export class SupervisorsComponent implements OnInit {

  form: UntypedFormGroup;
  submitted = false;
  loading = false;
  supervisors = null;



  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService,
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      fullname: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
      username: ['', Validators.required],
      password: ['', [Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]],
      position : ['Supervisor'],
      role: [Role.User],
  });

   this.accountService.getAll()
    .pipe(first())
    .subscribe(supervisors => this.supervisors = supervisors);

  }


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

        this.createUser();

}

private createUser() {
  this.accountService.register(this.form.value)
      .pipe(first())
      .subscribe({
          next: () => {
              this.alertService.success('Supervisor added successfully', { keepAfterRouteChange: true });
              this.router.navigate(['../'], { relativeTo: this.route });
          },
          error: error => {
              this.alertService.error(error);
              this.loading = false;
          }
      });
}

}
