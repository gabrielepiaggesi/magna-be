import { Table } from "../../framework/models/Table";
import { UserStatus } from "../service/classes/UserStatus";
import { UserSubStatus } from "../service/classes/UserSubStatus";

export class User extends Table {
    public email: string;
    public bio: string;
    public age: number;
    public image_url: string;
    public status: UserStatus;
    public sub_status: UserSubStatus;
    public password: string;
    public whatsapp: number;
    public suspended_times: number = 0
    public banned_times: number = 0;
    public bad_report_times: number = 0;
    public telegram: string;
    public last_ip: string;
    public last_session: string;
    public accept_terms_and_conditions: number;
    public accept_DCMA_policy: number;
    public accept_acceptable_use_policy: number;
    public accept_privacy_policy: number;
    public accept_refund_policy: number;
    public equal_or_older_than_18yo: number;

    // tslint:disable-next-line:no-empty
    constructor() { super(); }
}
