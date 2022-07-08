import { Table } from "../../framework/models/Table";

export class TestImage extends Table {
    public test_id: number;
    public media_id: number;
    public image_url: string;
    public position_order: number;

    // tslint:disable-next-line:no-empty
    constructor() { super(); }
}