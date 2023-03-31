import { User } from "./user";
import { Request } from "./request";
/*
   Student Name : Manal Magdy Eid Khalil Eid
   Student ID : B1901825

*/
export class Department {
    departmentID: string;
    name: string;
    employees: User[];
    requests: Request[];
}
