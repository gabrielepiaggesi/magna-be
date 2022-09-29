import { Table } from "../../mgn-framework/models/Table";

export class AppVersion extends Table {
    public version_number: string;
    public obsolete_version: string;
    public check_version: number;

    // tslint:disable-next-line:no-empty
    constructor() { super(); }
}