import { Table } from "./Table";

export class Story extends Table {
    public user_id: number;
    public full_story_id: number;
    public title: string;
    public text: string;
    public lang: string;

    constructor() { super(); }
}