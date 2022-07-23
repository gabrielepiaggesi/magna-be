import { Repository } from "../../framework/repositories/Repository";
const db = require("../../connection");
import mysql2 from "mysql2";
import { Test } from "../model/Test";
import { TestOption } from "../model/TestOption";
import { TestText } from "../model/TestText";
import { TestImage } from "../model/TestImage";

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

    public async findByQuizIdWithJoin(quizId: number, conn,  query = null): Promise<any[]> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || 
            `select *, opt.id as option_id, text.id as text_id, img.id as images_id, test.id as test_id 
            from ${this.table} test 
            join tests_texts text on text.test_id = test.id and text.deleted_at is null 
            join tests_options opt on opt.test_id = test.id and opt.deleted_at is null 
            join tests_images img on img.test_id = test.id and img.deleted_at is null 
            where test.quiz_id = ${mysql2.escape(quizId)} 
            and test.deleted_at is null
            `)
            .then((results) => { console.log(
                results
            );
             return results});
    }
}