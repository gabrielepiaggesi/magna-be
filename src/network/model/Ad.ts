import { Table } from "../../framework/models/Table";
import { AdPurpose } from "../service/classes/AdPurpose";
import { AdLocation } from "../service/classes/AdLocation";

export class Ad extends Table {
    public user_id: number;
    public purpose: AdPurpose;
    public location: AdLocation;

    constructor() { super(); }
}