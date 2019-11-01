import { Table } from "./Table";

export class User extends Table {
    public name: string;
    public lastname: string;
    public email: string;
    public birthday: Date;
    public bio: string;
    public password: string;

    // tslint:disable-next-line:no-empty
    constructor() { super(); }
}
