import { Table } from "../../framework/models/Table";

export class Quiz extends Table {
    public author_user_id: number;
    public minutes: number;
    public check_camera: number;
    public check_mic: number;
    public topic: string;
    public category: string;
    public difficulty_level: number;
    public public: number;
    public tests_amount: number;
    public tests_points: number;

    // tslint:disable-next-line:no-empty
    constructor() { super(); }
}