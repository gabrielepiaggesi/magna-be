import { Table } from "../../framework/models/Table";

export class UserTestImage extends Table {
    job_offer_id: number;
    test_id?: number;
    user_id: number;
    media_id: number;
    image_url: string;
}