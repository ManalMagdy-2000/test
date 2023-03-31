/*
   Student Name : Manal Magdy Eid Khalil Eid
   Student ID : B1901825

*/
import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, materialize, dematerialize } from 'rxjs/operators';
import { Role, Schedule } from '@app/_models';

// array in local storage for registered users
const usersKey = 'users';
let users = JSON.parse(localStorage.getItem(usersKey)) || [];
users.push({ id: 1, username: 'admin', password: 'admin',
 fullname: 'HR Admin', department: 0, role: Role.HRAdmin });

//array in local storage for departments
const departmentsKey = 'departments';
const schedulesKey = 'schedules';
const schedules = JSON.parse(localStorage.getItem(schedulesKey)) || [];
let departments = JSON.parse(localStorage.getItem(departmentsKey)) || [];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;

        return handleRoute();

        function handleRoute() {
            switch (true) {
                case url.endsWith('/users/authenticate') && method === 'POST':
                    return authenticate();
                case url.endsWith('/users/register') && method === 'POST':
                    return register();
                case url.endsWith('/users') && method === 'GET':
                    return getUsers();
                //get current user
                case url.endsWith('/users/current') && method === 'GET':
                    return currentUser();
                case url.match(/\/users\/\d+$/) && method === 'GET':
                    return getUserById();
                case url.match(/\/users\/\d+$/) && method === 'PUT':
                    return updateUser();
                case url.match(/\/users\/\d+$/) && method === 'DELETE':
                    return deleteUser();
                case url.endsWith('/departments') && method === 'GET':
                    return getDepartments();
                case url.endsWith('/departments/add') && method === 'POST':
                    return addDepartment();
                case url.match(/\/departments\/\d+$/) && method === 'GET':
                    return getDepartmentById();
                //add schedule users/:id/schedule
                case url.match(/\/users\/\d+\/schedule$/) && method === 'POST':
                    return addSchedule();
   
                case url.endsWith('/schedule') && method === 'GET':
                    return getSchedules();
                // //get schedule by id /schedule/supervisor/:scheduleID
                // case url.match(/\/schedule\/supervisor\/\d+$/) && method === 'GET':
                //     return getScheduleBySupervisorId();
                // //get schedule by id /schedule/employee/:scheduleID
                // case url.match(/\/schedule\/employee\/\d+$/) && method === 'GET':
                //     return getScheduleByEmployeeId();
                // //update schedule /schedule/:scheduleID
                // case url.match(/\/schedule\/\d+$/) && method === 'PUT':
                //     return updateSchedule();
                case url.match(/\/departments\/request\/\d+$/) && method === 'POST':
                    return addRequest();
                //add employee to department
                case url.match(/\/departments\/Employee\/\d+$/) && method === 'POST':
                    return addEmployee();
                //departments/:departmentID/employee/schedule
                case url.match(/\/departments\/\d+\/employee\/schedule$/) && method === 'POST':
                    return addsEmployeeSchedule();
                //add review to request as departments/:departmentID/request/:requestID/review
                case url.match(/\/departments\/\d+\/request\/\d+\/review$/) && method === 'POST':
                    return addReview();
                //get request by id as departments/:departmentID/request/:requestID
                case url.match(/\/departments\/\d+\/request\/\d+$/) && method === 'GET':
                    return getRequestById();
                //update status /departments/${departmentID}/request/${requestID}/review/${reviewID}
                case url.match(/\/departments\/\d+\/request\/\d+\/review\/\d+$/) && method === 'POST':
                    return updateStatus();
                default:
                    // pass through any requests not handled above
                    return next.handle(request);
            }
        }

        // route functions

        function authenticate() {
            const { username, password } = body;
            const user = users.find(x => x.username === username && x.password === password);
            if (!user) return error('Username or password is incorrect');
            return ok({
                ...basicDetails(user),
                token: `fake-jwt-token.${user.id}`
            })
        }

        function register() {
            const user = body

            if (users.find(x => x.username === user.username)) {
                return error('Username "' + user.username + '" is already taken')
            }



            user.id = users.length ? Math.max(...users.map(x => x.id)) + 1 : 1;
            users.push(user);
            localStorage.setItem(usersKey, JSON.stringify(users));
            return ok();
        }

        function getUsers() {
            if (!isLoggedIn()) return unauthorized();
            return ok(users.map(x => basicDetails(x)));
        }

        function getUserById() {
            if (!isLoggedIn()) return unauthorized();

            const user = users.find(x => x.id === idFromUrl());
            return ok(basicDetails(user));
        }

        function updateUser() {
            if (!isLoggedIn()) return unauthorized();

            let params = body;
            let user = users.find(x => x.id === idFromUrl());

            // only update password if entered
            if (!params.password) {
                delete params.password;
            }

            // update and save user
            Object.assign(user, params);
            localStorage.setItem(usersKey, JSON.stringify(users));

            return ok();
        }

        function deleteUser() {
            if (!isLoggedIn()) return unauthorized();

            users = users.filter(x => x.id !== idFromUrl());
            localStorage.setItem(usersKey, JSON.stringify(users));
            return ok();
        }

        // helper functions

        function ok(body?) {
            return of(new HttpResponse({ status: 200, body }))
                .pipe(delay(500)); // delay observable to simulate server api call
        }

        function error(message) {
            return throwError({ error: { message } })
                .pipe(materialize(), delay(500), dematerialize()); // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648);
        }

        function unauthorized() {
            return throwError({ status: 401, error: { message: 'Unauthorized' } })
                .pipe(materialize(), delay(500), dematerialize());
        }

        function basicDetails(user) {
            const { id, username, fullname, email, role, department, position, schedules } = user;
            return { id, username, fullname, email, role, department,  position, schedules };
        }

        function isEmployee() {
            return isLoggedIn() && currentUser().role === Role.Employee;
        }
        function isSupervisor(){
          return isLoggedIn() && currentUser().role === Role.User;
        }

        function isHRAdmin() {
            return isLoggedIn() && currentUser().role === Role.HRAdmin;
        }

        function currentUser() {
            if (!isLoggedIn()) return;
            const id = parseInt(headers.get('Authorization').split('.')[1]);
            return users.find(x => x.id === id);
        }

        function isLoggedIn() {
            const authHeader = headers.get('Authorization') || '';
            return authHeader.startsWith('Bearer fake-jwt-token');
        }

        function idFromUrl() {
            const urlParts = url.split('/');
            return parseInt(urlParts[urlParts.length - 1]);
        }

        function getDepartments() {
            // if (!isLoggedIn()) return unauthorized();
            return ok(departments.map(x => departmentDetails(x)));
        }

        function departmentDetails(department) {
            const { departmentID, name, employees, requests , supervisors } = department;
            return { departmentID, name, employees, requests  , supervisors};
        }

        function addDepartment() {
            const department = body

            department.departmentID = departments.length ? Math.max(...departments.map(x => x.departmentID)) + 1 : 1;
            departments.push(department);
            localStorage.setItem(departmentsKey, JSON.stringify(departments));
            return ok();
        }

        function getDepartmentById() {
            if (!isLoggedIn()) return unauthorized();

            const department = departments.find(x => x.departmentID === idFromUrl());
            return ok(departmentDetails(department));
        }

        function addRequest() {
            if (!isLoggedIn()) return unauthorized();

            let params = body;
            let department = departments.find(x => x.departmentID === idFromUrl());
            console.log(params)
            console.log(department.requests.length)
            params.requestID = department.requests.length + 1;

            console.log(department)
            // update and save department
            department.requests.push(params);
            localStorage.setItem(departmentsKey, JSON.stringify(departments));

            return ok();
        }

        function getRequestById() {
            if (!isLoggedIn()) return unauthorized();

            const department = departments.find(x => x.departmentID === idFromUrl());
            const request = department.requests.find(x => x.requestID === idFromUrl());
            return ok(request);
        }

        function addEmployee() {
            if (!isLoggedIn()) return unauthorized();

            let params = body;
            let department = departments.find(x => x.departmentID === idFromUrl());

            department.employees.push(params.Employee);
            localStorage.setItem(departmentsKey, JSON.stringify(departments));

            return ok();
        }

        function addsEmployeeSchedule() {
            if (!isLoggedIn()) return unauthorized();

            let params = body;
            let department = departments.find(x => x.departmentID === idFromUrl());

            department.employees.push(params.Employee);
            localStorage.setItem(departmentsKey, JSON.stringify(departments));

            return ok();

        }

        function addSchedule() {
            if (!isLoggedIn()) return unauthorized();

            //get userID from url without idFromUrl()
            let uID = url.split('/')[4];
 
            let params = body;
            let user = users.find(x => x.id === parseInt(uID));
            let schedule = params as Schedule;

            user.schedules.push(schedule);
            localStorage.setItem(usersKey, JSON.stringify(users));
            localStorage.setItem('user', JSON.stringify(user));
            return ok();

        }

        function getSchedules() {
            if (!isLoggedIn()) return unauthorized();
            let schedules = [];
            users.forEach(user => {
                user.schedules?.forEach(schedule => {
                    schedule.userID = user.id;
                    schedule.fullname = user.username;
                    schedule.supervisorID = user.supervisorID;
                    schedules.push(schedule);
                });
            });
            return ok(schedules);
        }



        function addReview() {
            if (!isLoggedIn()) return unauthorized();

            let params = body;
            //get departmentID from url without idFromUrl()
            let sID = url.split('/')[4];

            let department = departments.find(x => x.departmentID === parseInt(sID));
            //get requestID from url without idFromUrl()
            console.log(department)
            let rID = url.split('/')[6];
            let request = department.requests.find(x => x.requestID === parseInt(rID));
            console.log(rID)
            console.log(request.reviews.length)
            params.reviewID = request.reviews.length + 1;
            params.reviewStatus = "PENDING";
            params.reviewDate = new Date().getDate() + "/" + (new Date().getMonth() + 1) + "/" + new Date().getFullYear();
            request.reviews.push(params);

            let user = users.find(x => x.id === params.User.id);
            user.reviews.push(params);
            localStorage.setItem(usersKey, JSON.stringify(users));
            localStorage.setItem(departmentsKey, JSON.stringify(departments));

            return ok();
        }

        function updateStatus() {
            if (!isLoggedIn()) return unauthorized();

            let params = body;
            //get departmentID from url without idFromUrl()
            let sID = url.split('/')[4];

            let department = departments.find(x => x.departmentID === parseInt(sID));
            //get requestID from url without idFromUrl()

            let rID = url.split('/')[6];


            let request = department.requests.find(x => x.requestID === parseInt(rID));
            request.status = "CLOSED";

            let oID = url.split('/')[8];

            if(oID != null){
                let review = request.reviews.find(x => x.reviewID === parseInt(oID));
                review.reviewStatus = params.status;
            }

            localStorage.setItem(departmentsKey, JSON.stringify(departments));


            return ok();
        }
    }
}

export const fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};
