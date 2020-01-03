import { Table } from "./Table";

export class Story extends Table {
    public user_id: number;
    public title: string;
    public text: string;

    constructor() { super(); }
}