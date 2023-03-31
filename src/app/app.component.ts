/*
   Student Name : Manal Magdy Eid Khalil Eid
   Student ID : B1901825

*/
import { Component } from '@angular/core';

import { AccountService, DepartmentService } from './_services';
import { Role, Department, User } from './_models';
import { INavData } from '@coreui/angular';
import { IconSetService } from '@coreui/icons-angular';
import { cilListNumbered, cilPaperPlane, cilHome, cilBank, cilUser, brandSet } from '@coreui/icons';


@Component({ selector: 'app', templateUrl: 'app.component.html', providers: [IconSetService] })
export class AppComponent {
    user: User;
    department: Department;
    departmentsCount: number = 0;
    navItems: INavData[] = [

    ];

    constructor(private accountService: AccountService, public iconSet: IconSetService, private departmentService: DepartmentService) {
        this.accountService.user.subscribe(x => this.user = x)
        if(this.user && this.user.role === Role.Employee) {
          this.departmentService.getDepartmentById(this.user.department).subscribe(department => {
            this.department = department;
            console.log( this.department.name )
          });
        }
        this.departmentService.getAllDepartments().subscribe(departments => {
          this.departmentsCount = departments.length;
          console.log( this.departmentsCount )
        })
        iconSet.icons = { cilListNumbered, cilPaperPlane, cilHome, cilBank, cilUser, ...brandSet };
    }

    get isEmployee() {
        return this.user && this.user.role === Role.Employee;
    }

    get isSupervisor(){
      return this.user && this.user.position == "supervisor" || this.user.position == "Supervisor";
   }

    get isHRAdmin() {
        return this.user && this.user.role === Role.HRAdmin;
    }

    ngOnInit() {

      this.navItems.push(
      {
        name: 'Menu',
        title: true
      },

      // {
      //   name: 'Home',
      //   url: '/',
      //   iconComponent: { name: 'cil-home' },
      // },
     /* {
        name: 'Requests',
        url: '/reviews',
        iconComponent: { name: 'cil-list-numbered' },
      },
    */

      )

      if (this.isHRAdmin) {
        this.navItems.push(
          {
            name: 'Departments',
            url: '/departments',
            iconComponent: { name: 'cil-bank' },
           /* badge: {
              color: 'success',
              text: ""+this.departmentsCount,
              size: 'lg',
               }*/
          },
          {
            name: 'Employees',
            url: '/employees',
            iconComponent: { name: 'cil-user' },
            // badge: {
            //   color: 'success',
            //   text: ""+this.departmentsCount,
            //   size: 'lg',
            // }
          },
          {
            name: 'Supervisors',
            url: '/supervisors',
            iconComponent: { name: 'cil-user' },
            // badge: {
            //   color: 'success',
            //   text: ""+this.departmentsCount,
            //   size: 'lg',
            // }
          },
        )
      }

      if (this.isEmployee && !this.isSupervisor) {
        this.navItems.push(
          {
            name: 'Profile',
            url: `/users/edit/${this.user?.id}`,
            iconComponent: { name: 'cil-user' },
          },
          {
            name: 'Submit Request',
            url: '/requests',
            iconComponent: { name: 'cil-paper-plane' },
            // badge: {
            //   color: 'success',
            //   text: 'NEW',
            //   size: 'lg',
            // }
          },
          {
            name: 'Schedules',
            url: `/users/${this.user?.id}/schedule`,
            iconComponent: { name: 'cil-list-numbered' },
          },
        )
      }

      if (this.isSupervisor) {
        this.navItems.push(
          {
            name: 'Profile',
            url: `/users/edit/${this.user?.id}`,
            iconComponent: { name: 'cil-user' },
          },
          {
            name: 'View Requests',
            url: '/reviewRequest',
            iconComponent: { name: 'cil-list-numbered' },
            // badge: {
            //   color: 'success',
            //   text: 'NEW',
            //   size: 'lg',
            // }
          },
          {
            name: 'Review Schedules',
            url: `/schedule`,
            iconComponent: { name: 'cil-list-numbered' },
          },

        )
      }

    }

    ngOnDestroy() {
      this.navItems = [];
    }



    logout() {
        this.navItems = [];
        this.accountService.logout();
    }
}
