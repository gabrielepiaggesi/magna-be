import { Table } from "../../framework/models/Table";

export class UserLink extends Table {
    public user_id: number;
    public link_for: 'EXAM'|'JOB';
    public entity_id: number;

    // tslint:disable-next-line:no-empty
    constructor() { super(); }
}
