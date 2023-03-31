import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import {UserComponent } from './user';
import { AuthGuard } from './_helpers';
import { Role } from './_models';
import { RequestComponent } from './request/request.component';
import { EmployeesComponent } from './employees/employees.component';
import { SupervisorsComponent } from './supervisors/supervisors.component';
import { ReviewRequestComponent } from './review-request/review-request.component';
import { ScheduleReviewComponent } from './schedules/schedule-review.component';
import { AddEditComponent } from './users/add-edit.component';
import { LoginComponent } from './account/login.component';
const accountModule = () => import('./account/account.module').then(x => x.AccountModule);
const usersModule = () => import('./users/users.module').then(x => x.UsersModule);
const departmentsModule = () => import('./departments/departments.module').then(x => x.DepartmentsModule);

const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'users', loadChildren: usersModule, canActivate: [AuthGuard] },
    { path: 'departments', loadChildren: departmentsModule, canActivate: [AuthGuard], data: { roles: [Role.HRAdmin] } },
    { path: 'account', loadChildren: accountModule },
    { path: 'requests', component: RequestComponent, canActivate: [AuthGuard], data: { roles: [Role.Employee] }  },
    { path: 'Employee', component:UserComponent, canActivate: [AuthGuard], data: { roles: [Role.Employee] } },
    { path: 'employees', component: EmployeesComponent, canActivate: [AuthGuard], data: { roles: [Role.HRAdmin] } },
    { path: 'supervisors', component: SupervisorsComponent, canActivate: [AuthGuard], data: { roles: [Role.HRAdmin] } },
    { path: 'reviewRequest' , component: ReviewRequestComponent, canActivate: [AuthGuard], data: { roles: [Role.User] }},
    { path: 'schedule', component: ScheduleReviewComponent, canActivate: [AuthGuard] },
    { path: 'edit/:id', component: AddEditComponent },    // otherwise redirect to home
    { path: '**', redirectTo: '/edit/:id' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
