import { Table } from "./Table";

export class FullStory extends Table {
    public user_id: number;
    public title: string;
    public text: string;
    public lang: string;

    constructor() { super(); }
}