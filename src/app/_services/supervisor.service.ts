/*
Student Name : Manal Magdy Eid Khalil
Student ID : B1901825
*/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '@app/_models';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SupervisorService {
  constructor(private _http: HttpClient) {}

  addSupervisor(data: any): Observable<any> {
    return this._http.post<User[]>(`${environment.apiUrl}/supervisors`, data);
  }

  updateSupervisor(id: number, data: any): Observable<any> {
    return this._http.put<User[]>(`${environment.apiUrl}/supervisors/${id}`, data);
  }
  getSupervisorList(): Observable<any> {
    return this._http.get<User[]>(`${environment.apiUrl}/supervisors`);
  }

  deleteSupervisor(id: number): Observable<any> {
    return this._http.delete<User[]>(`${environment.apiUrl}/supervisors/${id}`);
  }
}
