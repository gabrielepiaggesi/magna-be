import { Repository } from "../../framework/repositories/Repository";
const db = require("../../connection");
import mysql2 from "mysql2";
import { Quiz } from "../model/Quiz";

export class QuizRepository extends Repository<Quiz> {
    public table = "quizs";
    // ${mysql2.escape(stripeId)}
}
