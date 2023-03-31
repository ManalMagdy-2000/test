/*
   Student Name : Manal Magdy Eid Khalil Eid
   Student ID : B1901825

*/
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@app/_helpers';
import { Role } from '@app/_models';
import { LayoutComponent } from './layout.component';
import { ListComponent } from './list.component';
import { AddEditComponent } from './add-edit.component';
import { AddRequestComponent } from './add-request.component';
import {  AddEmployeeComponent } from './add-Employee.component';
import { AddSupervisorComponent } from './add-supervisor.component';
import { AddReviewComponent } from './add-review.component';
import { EmployeesComponent } from '../employees/employees.component';
import { ListsupervisorComponent } from './listsupervisor.component';

const routes: Routes = [
    {
        path: '', component: LayoutComponent,
        children: [
            { path: '', component: ListComponent },
            { path: 'add', component: AddEditComponent },
            { path: 'request/:id', component: AddRequestComponent },
            { path: 'Employee/:id', component:  AddEmployeeComponent },
            { path : 'Supervisor/:id' , component : AddSupervisorComponent},
            { path: ':departmentID/request/:requestID', component: AddReviewComponent },
            { path: 'employees', component: EmployeesComponent, canActivate: [AuthGuard], data: { roles: [Role.HRAdmin] } },
            { path: 'supervisors', component: ListsupervisorComponent, canActivate: [AuthGuard], data: { roles: [Role.HRAdmin] } },

        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DepartmentsRoutingModule { }
