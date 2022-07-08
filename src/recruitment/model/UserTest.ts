import { Table } from "../../framework/models/Table";

export class UserTest extends Table {
    public user_id: number;
    public test_id: number;
    public user_quiz_id: number;
    public option_id: number;
    public answer: string;
    public score: number;
    public media_id: number;

    // tslint:disable-next-line:no-empty
    constructor() { super(); }
}