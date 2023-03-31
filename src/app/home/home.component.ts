import { Component } from '@angular/core';

import { Role, Department, User } from '@app/_models';
import { AccountService, DepartmentService, ScheduleService } from '@app/_services';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent {
    user: User;
    department: Department;
    isEmployee: boolean;
    departments = [];
    users = [];
    schedules = [];
    departmentsCount: number = 0;
    departmentRequestsCount: number = 0;
    depEmployeeCount: number = 0;
    depReq1 = 0;
    depReq2 = 0;
    depReq3 = 0;
    statsArray = [];

    constructor(private accountService: AccountService, private departmentService: DepartmentService, private scheduleService: ScheduleService) {
        this.user = this.accountService.userValue;
        console.log(this.user)
        this.isEmployee = this.user && this.user.role === Role.Employee;
        if(this.isEmployee) {
          this.departmentService.getDepartmentById(this.user.department).subscribe(department => {
            this.department = department;
  
            console.log( this.department )
          });
        }
        else {
          this.departmentService.getAllDepartments().subscribe(departments => {
            this.departments = departments;
            departments.forEach(department => {
                this.departmentsCount = departments.length;
                this.departmentRequestsCount = department.requests.length;
                this.depEmployeeCount = department.employees.length;
                this.depReq1 = department.requests.filter(request => request.status == "flexi").length;
                this.depReq2 = department.requests.filter(request => request.status == "wfh").length;
                this.depReq3 = department.requests.filter(request => request.status == "hybrid").length;
                this.statsArray.push({
                  id: department.departmentID,
                  stats: {
                  name: department.name,
                  requests: this.departmentRequestsCount,
                  employees: this.depEmployeeCount,
                  flexi: this.depReq1,
                  wfh: this.depReq2,
                  hybrid: this.depReq3
                }});
                console.log( this.statsArray )
            });

            console.log( this.departments )
          })
          this.accountService.getAll().subscribe(users => {
            this.users = users;
            users.forEach(user => {
              if(user.role == "Employee") {
                this.statsArray.forEach(stat => {
                  if(stat.id == user.department) {
                    console.log(user.schedules)
                    if(user.schedules) {
                      stat.stats.schedules = user.schedules.length;
                      //filter unique dates store earliest date and latest date 
                      let uniqueDates = user.schedules.filter((v,i,a)=>a.findIndex(t=>(t.date === v.date))===i);
                      stat.stats.earliestDate = uniqueDates[0].date;
                      stat.stats.latestDate = uniqueDates[uniqueDates.length - 1].date;
                      //filter unique workHours and count each then store in array
                      let uniqueWorkHours = user.schedules.filter((v,i,a)=>a.findIndex(t=>(t.workHours === v.workHours))===i);
                      let workHoursCount = [];
                      uniqueWorkHours.forEach(workHour => {
                        let count = user.schedules.filter(schedule => schedule.workHours == workHour.workHours).length;
                        workHoursCount.push({workHour: workHour.workHours, count: count});
                      }
                      )
                      stat.stats.workHoursCount = workHoursCount;
                      
                    }
                  }
                })
              }
            })
            console.log( this.statsArray )
          });
          this.scheduleService.getAllSchedules().subscribe(schedules => {
            this.schedules = schedules;
            console.log( this.schedules )
          });
        }
    }


    logout() {
        this.accountService.logout();
    }
}
/*
   Student Name : Manal Magdy Eid Khalil Eid
   Student ID : B1901825

*/
