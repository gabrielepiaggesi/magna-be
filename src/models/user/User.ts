import { Table } from "../Table";

export class User extends Table {
    public email: string;
    public username: string;
    public image_url: string;
    public status: string;
    public password: string;
    public lang: string;
    public last_ip: string;
    public last_session: string;

    // tslint:disable-next-line:no-empty
    constructor() { super(); }
}
