import { Table } from "../../mgn-framework/models/Table";

export class UserSocialPost extends Table {
    public user_id: number;
    public business_id: number;
    public discount_id: number;
    public status: string;
    public url: string;
    public social: string;

    // tslint:disable-next-line:no-empty
    constructor() { super(); }
}