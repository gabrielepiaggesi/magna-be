import { Table } from "../../framework/models/Table";
import { CompanyStatus } from "../type/CompanyStatus";

export class Company extends Table {
    public email: string;
    public description: string;
    public name: string;
    public logo: string;
    public hq_country: string;
    public hq_city: string;
    public hq_address: string;
    public category: string;
    public website: string;
    public media_id: number;
    public author_user_id: number;
    public employees_amount: number;
    public status: CompanyStatus;
    public birthdate: string;

    // tslint:disable-next-line:no-empty
    constructor() { super(); }
}
