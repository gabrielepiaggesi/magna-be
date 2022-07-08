import { Table } from "../../framework/models/Table";

export class JobOffer extends Table {
    public author_user_id: number;
    public company_id: number;
    public status: string;
    public lang: string;
    public role: string;
    public country: string;
    public city: string;
    public address: string;
    public equipment: string;
    public description: string;
    public mode: string;
    public type: string;
    public public: number;
    public contract_timing: string;
    public contract_type: string;
    public salary_range: string;
    public expired_at: string;

    // tslint:disable-next-line:no-empty
    constructor() { super(); }
}
