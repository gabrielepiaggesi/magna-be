import { Repository } from "../../framework/repositories/Repository";
const db = require("../../connection");
import mysql2 from "mysql2";
import { Test } from "../model/Test";

export class TestRepository extends Repository<Test> {
    public table = "tests";
    // ${mysql2.escape(stripeId)}

    public async findByQuizId(quizId: number, conn,  query = null): Promise<Test[]> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || 
            `select * from ${this.table} where quiz_id = ${mysql2.escape(quizId)} and deleted_at is null`)
            .then((results) => results);
    }
}
