import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// used to create fake backend
import { fakeBackendProvider } from './_helpers';

import { AppRoutingModule } from './app-routing.module';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { AppComponent } from './app.component';
import { AlertComponent } from './_components';
import { HomeComponent } from './home';
import {UserComponent } from './user';
import { RequestComponent } from './request/request.component';
import { AccordionModule, AlertModule, AvatarModule, BadgeModule, ButtonModule, CardModule, DropdownModule, FormModule, GridModule, HeaderModule, ModalModule, NavModule, SharedModule, SidebarModule, TableModule, ToastModule, UtilitiesModule } from '@coreui/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IconModule } from '@coreui/icons-angular';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { EmployeesComponent } from './employees/employees.component';
import { SupervisorsComponent } from './supervisors/supervisors.component';
import { ReviewRequestComponent } from './review-request/review-request.component';
import { ScheduleReviewComponent } from './schedules/schedule-review.component';
import { AddEditComponent } from './users/add-edit.component';

@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        AppRoutingModule,
        AccordionModule,
        SharedModule,
        BrowserAnimationsModule,
        TableModule,
        BadgeModule,
        SidebarModule,
        GridModule,
        UtilitiesModule,
        ModalModule,
        ButtonModule,
        FormModule,
        ToastModule,
        IconModule,
        HeaderModule,
        NavModule,
        DropdownModule,
        AvatarModule,
        CardModule,
        NgxMaterialTimepickerModule
    ],
    declarations: [
        AppComponent,
        AlertComponent,
        HomeComponent,
       UserComponent,
        RequestComponent,
        EmployeesComponent,
        SupervisorsComponent,
        ReviewRequestComponent,
        ScheduleReviewComponent,
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

        // provider used to create fake backend
        fakeBackendProvider
    ],
    bootstrap: [AppComponent]
})
export class AppModule { };
/*
   Student Name : Manal Magdy Eid Khalil Eid
   Student ID : B1901825

*/
