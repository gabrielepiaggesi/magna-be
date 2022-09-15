import { Table } from "../../mgn-framework/models/Table";

export class Media extends Table {
    public user_id: number;
    public type: string = 'IMAGE';
    public url: string;
    public private_url: string;
    public provider: string = 'FIREBASE_STORAGE';
    public provider_path: string;
    public size: string;
    public name: string;

    constructor() { super(); }
}