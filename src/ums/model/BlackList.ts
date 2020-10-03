import { Table } from "../../framework/models/Table";
import { BlackListReason } from "../service/classes/BlackListReason";

export class BlackList extends Table {
    public user_id: number;
    public reason: BlackListReason;
    public reporter_id: number;
    public text: string;

    constructor() { super(); }
}