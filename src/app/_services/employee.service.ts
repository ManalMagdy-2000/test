import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { Department, Request, User, Review } from '@app/_models';
import { Role } from '../_models/role';

@Injectable({ providedIn: 'root' })
export class EmployeeService {

    constructor(
        private router: Router,
        private http: HttpClient
    ) { }



    getAllEmployees() {
        return this.http.get<User[]>(`${environment.apiUrl}/departments`);
    }

    getEmployeeById(id: string) {
        return this.http.get<User>(`${environment.apiUrl}/departments/${id}`);
    }

    addRequest(id: string, request: Request) {
        return this.http.post(`${environment.apiUrl}/departments/request/${id}`, request);
    }

    getRequestById(departmentID: string, requestID: string) {
        return this.http.get<Request>(`${environment.apiUrl}/departments/${departmentID}/request/${requestID}`);
    }

    addSupervisor(id: string, Supervisor: User) {
        return this.http.post(`${environment.apiUrl}/departments/Supervisor/${id}`, { Supervisor });
    }

    getAllSupervisors(){
      return this.http.get<User[]>(`${environment.apiUrl}/supervisors`);
    }

    addReview(departmentID: string, requestID: string, review: Review) {
        return this.http.post(`${environment.apiUrl}/departments/${departmentID}/request/${requestID}/review`, review);
    }

    updateStatus(departmentID: string, requestID: string, reviewID: string, status: string) {
        console.log(departmentID, requestID, reviewID, status);
        return this.http.post(`${environment.apiUrl}/departments/${departmentID}/request/${requestID}/review/${reviewID}`, { status });
    }
}
