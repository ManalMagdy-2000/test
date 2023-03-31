/*
   Student Name : Manal Magdy Eid Khalil Eid
   Student ID : B1901825

*/
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { DepartmentsRoutingModule } from './departments-routing.module';
import { LayoutComponent } from './layout.component';
import { ListComponent } from './list.component';
import { AddEditComponent } from './add-edit.component';
import { AddRequestComponent } from './add-request.component';
import {  AddEmployeeComponent } from './add-Employee.component';
import { AddReviewComponent } from './add-review.component';
import { AccordionModule, BadgeModule, ButtonModule, FormModule, ModalModule, SharedModule, TableModule, UtilitiesModule } from '@coreui/angular';
import { AddSupervisorComponent } from './add-supervisor.component';
import { ListsupervisorComponent } from './listsupervisor.component';
@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        DepartmentsRoutingModule,
        ModalModule,
        AccordionModule,
        TableModule,
        BadgeModule,
        UtilitiesModule,
        FormModule,
        ButtonModule,
        SharedModule
    ],
    declarations: [
        LayoutComponent,
        ListComponent,
        AddEditComponent,
        AddRequestComponent,
         AddEmployeeComponent,
        AddReviewComponent,
        AddSupervisorComponent,
        ListsupervisorComponent
    ]
})
export class DepartmentsModule { }
