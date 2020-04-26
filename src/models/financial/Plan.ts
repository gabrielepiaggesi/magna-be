import { Table } from "../Table";

export class Plan extends Table {
    public stripe_plan_id: string;
    public status: string;
    public amount: number;
    public frequency: string;
    public title: string;
    public bio: string;

    constructor() { super(); }
}