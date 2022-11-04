import { Table } from "../../mgn-framework/models/Table";
var moment = require('moment');

export class User extends Table {
    public email: string;
    public description: string;
    public name: string;
    public lastname: string;
    public age: number;
    public phone_number: string;
    public media_id: number;
    public status: string;
    public password: string;
    public last_ip: string;
    public birthday: string;
    public accept_terms_and_condition: number;
    public last_session: string;
    public referral_code: string;
    public lang: string;

    // tslint:disable-next-line:no-empty
    constructor() { super(); }
}
