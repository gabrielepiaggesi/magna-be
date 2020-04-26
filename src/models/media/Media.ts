import { Table } from "../Table";

export class Media extends Table {
    public user_id: number;
    public type: string = 'IMAGE';
    public url: string;
    public private_url: string;
    public provider: string = 'FIREBASE_STORAGE';
    public provider_path: string;
    public detail: string;

    constructor() { super(); }
}