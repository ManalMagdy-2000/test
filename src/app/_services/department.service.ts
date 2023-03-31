import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';


import { environment } from '@environments/environment';
import { Department, Request, User, Review } from '@app/_models';
import { Subject} from 'rxjs';
import { tap } from 'rxjs/operators';


@Injectable({ providedIn: 'root' })
export class DepartmentService {

    constructor(
        private router: Router,
        private http: HttpClient
    ) { }

    private _refreshrequired = new Subject<void>();
    get requiredRefresh(){
      return this._refreshrequired;
    }

    addDepartment(department: Department) {
        return this.http.post(`${environment.apiUrl}/departments/add`, department).pipe(
          tap(() => {
            this._refreshrequired.next(); // pipe and tap to trigger the next processa and show the departments without refreshing the page
          })
        );
    }

    getAllDepartments() {
        return this.http.get<Department[]>(`${environment.apiUrl}/departments`);
    }

    getDepartmentById(id: string) {
        return this.http.get<Department>(`${environment.apiUrl}/departments/${id}`);
    }

    addRequest(id: string, request: Request) {
        return this.http.post(`${environment.apiUrl}/departments/request/${id}`, request);
    }

    getRequestById(departmentID: string, requestID: string) {
        return this.http.get<Request>(`${environment.apiUrl}/departments/${departmentID}/request/${requestID}`);
    }

    addEmployee(id: string, Employee: User) {
        return this.http.post(`${environment.apiUrl}/departments/Employee/${id}`, { Employee });
    }

    getAllEmployees(){
      return this.http.get<User[]>(`${environment.apiUrl}/employees`);
    }

    addReview(departmentID: string, requestID: string, review: Review) {
        return this.http.post(`${environment.apiUrl}/departments/${departmentID}/request/${requestID}/review`, review);
    }

    updateStatus(departmentID: string, requestID: string, reviewID: string, status: string) {
        console.log(departmentID, requestID, reviewID, status);
        return this.http.post(`${environment.apiUrl}/departments/${departmentID}/request/${requestID}/review/${reviewID}`, { status });
    }
}
