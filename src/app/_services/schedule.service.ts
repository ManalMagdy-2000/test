import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { Department, Request, User, Review, Schedule } from '@app/_models';


@Injectable({ providedIn: 'root' })
export class ScheduleService {

    constructor(
        private router: Router,
        private http: HttpClient
    ) { }

    addSchedule(schedule: Schedule, id: string) {
        console.log(schedule, id)
        return this.http.post(`${environment.apiUrl}/users/${id}/schedule`, schedule);
    }

    getAllSchedules() {
        return this.http.get<Schedule[]>(`${environment.apiUrl}/schedule`);
    }

    getScheduleBySupervisorId(id: string) {
        return this.http.get<Schedule[]>(`${environment.apiUrl}/schedule/${id}`);
    }

    getScheduleByEmployeeId(id: number) {
        return this.http.get<Schedule[]>(`${environment.apiUrl}/schedule/${id}`);
    }

    updateSchedule(schedule: Schedule) {
        return this.http.put(`${environment.apiUrl}/schedule`, schedule);
    }
}
