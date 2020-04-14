import { Table } from "../Table";

export class Detail extends Table {
    public user_id: number;
    public type: string;
    public text1: string;
    public text2: string;
    public text3: string;
    public lang: string;
    public start_date: string;
    public end_date: string;

    constructor() { super(); }
}