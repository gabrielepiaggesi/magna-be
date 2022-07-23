import { Repository } from "../../framework/repositories/Repository";
const db = require("../../connection");
import mysql2 from "mysql2";
import { TestImage } from "../model/TestImage";

export class TestImageRepository extends Repository<TestImage> {
    public table = "tests_images";
    // ${mysql2.escape(stripeId)}

    public async findByTestId(testId: number, conn,  query = null): Promise<TestImage[]> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || 
            `select * from ${this.table} where test_id = ${mysql2.escape(testId)} and deleted_at is null order by id desc`)
            .then((results) => results);
    }

    public async findByTestIdsIn(testIds: number[], conn,  query = null): Promise<TestImage[]> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || 
            `select * from ${this.table} where test_id in (?) and deleted_at is null`, [testIds])
            .then((results) => results);
    }
}
