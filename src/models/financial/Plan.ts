import { Table } from "../Table";

export class Plan extends Table {
    public stripe_plan_id: string;
    public status: string;
    public amount: number;
    public frequency: string;

    constructor() { super(); }
}