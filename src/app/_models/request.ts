import { Review } from "./review";
/*
   Student Name : Manal Magdy Eid Khalil Eid
   Student ID : B1901825

*/
export class Request {
    requestID: string;
    description: string;
    date: string;
    time: string;
    studentLevel: string;
    numberOfStudents: number;
    status: string;
    reviews: Review[];
}
