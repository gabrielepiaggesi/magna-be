import { Table } from "./Table";

export class StorySaved extends Table {
    public full_story_id: number;
    public user_id: number;

    constructor() { super(); }
}