import { Table } from "../../framework/models/Table";

export class UserSkill extends Table {
    public user_id: number;
    public job_offer_skill_id: number;
    public job_offer_id: number;
    public exam_skill_id: number;
    public exam_id: number;
    public confidence_level: number;
    public years: number;

    // tslint:disable-next-line:no-empty
    constructor() { super(); }
}