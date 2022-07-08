import { Repository } from "../../framework/repositories/Repository";
const db = require("../../connection");
import mysql2 from "mysql2";
import { CompanyQuiz } from "../model/CompanyQuiz";

export class CompanyQuizRepository extends Repository<CompanyQuiz> {
    public table = "companies_quizs";
    // ${mysql2.escape(stripeId)}
}
