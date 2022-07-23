import { Repository } from "../../framework/repositories/Repository";
const db = require("../../connection");
import mysql2 from "mysql2";
import { TestOption } from "../model/TestOption";

export class TestOptionRepository extends Repository<TestOption> {
    public table = "tests_options";
    // ${mysql2.escape(stripeId)}

    public async findByTestId(testId: number, conn,  query = null): Promise<TestOption[]> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || 
            `select * from ${this.table} where test_id = ${mysql2.escape(testId)} and deleted_at is null`)
            .then((results) => results);
    }

    public async findByTestIdsIn(testIds: number[], conn,  query = null): Promise<TestOption[]> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || 
            `select * from ${this.table} where test_id in (?) and deleted_at is null`, [testIds])
            .then((results) => {
                return results
            });
    }

    public async findByIdsIn(ids: number[], conn,  query = null): Promise<TestOption[]> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || 
            `select * from ${this.table} where id in (?) and deleted_at is null`, [ids])
            .then((results) => {
                return results
            });
    }

    public async findCorrectOptionByTestId(testId: number, conn,  query = null): Promise<TestOption> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || 
            `select * from ${this.table} where test_id = ${mysql2.escape(testId)} and is_correct = 1 and deleted_at is null order by id desc limit 1`)
            .then((results) => results[0] || null);
    }
}
