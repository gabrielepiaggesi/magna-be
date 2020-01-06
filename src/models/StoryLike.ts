import { Table } from "./Table";

export class StoryLike extends Table {
    public full_story_id: number;
    public user_id: number;

    constructor() { super(); }
}