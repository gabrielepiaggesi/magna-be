import { Repository } from "../../framework/repositories/Repository";
const db = require("../../connection");
import mysql2 from "mysql2";
import { JobOffer } from "../model/JobOffer";
import { JobOfferSkill } from "../model/JobOfferSkill";
import { ExamSkill } from "../model/ExamSkill";

export class ExamSkillRepository extends Repository<ExamSkill> {
    public table = "exams_skills";
    // ${mysql2.escape(stripeId)}
    
    public async findByExamId(examId: number, conn,  query = null): Promise<ExamSkill[]> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || 
            `select * from ${this.table} where exam_id = ${mysql2.escape(examId)} and deleted_at is null`)
            .then((results) => results);
    }
}
