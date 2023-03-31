import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '@app/_models';
import { AccountService } from '@app/_services';

@Component({ templateUrl: 'user.component.html' })
export class UserComponent implements OnInit {
    loading = false;
    users: User[] = [];

    constructor(private userService: AccountService) { }

    ngOnInit() {
        this.loading = true;
        this.userService.getAll().pipe(first()).subscribe(users => {
            this.loading = false;
            this.users = users;
        });
    }
}
/*
   Student Name : Manal Magdy Eid Khalil Eid
   Student ID : B1901825

*/
