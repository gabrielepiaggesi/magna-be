import { Repository } from "../../framework/repositories/Repository";
const db = require("../../connection");
import mysql2 from "mysql2";
import { UserTest } from "../model/UserTest";

export class UserTestRepository extends Repository<UserTest> {
    public table = "users_tests";
    // ${mysql2.escape(stripeId)}

    public async findByUserIdAndTestId(userId: number, testId: number, conn, query = null): Promise<UserTest> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || 
            `select * from ${this.table} 
            where user_id = ${mysql2.escape(userId)} 
            and test_id = ${mysql2.escape(testId)} 
            and deleted_at is null 
            order by id desc 
            limit 1`)
            .then((results) => results[0] || null);
    }

    public async findByUserIdAndUserQuizId(userId: number, userQuizId: number, conn, query = null): Promise<UserTest[]> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || 
            `select * from ${this.table} 
            where user_id = ${mysql2.escape(userId)} 
            and user_quiz_id = ${mysql2.escape(userQuizId)} 
            and deleted_at is null`)
            .then((results) => results);
    }
}
