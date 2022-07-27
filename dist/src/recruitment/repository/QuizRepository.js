"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Repository_1 = require("../../framework/repositories/Repository");
const db = require("../../connection");
class QuizRepository extends Repository_1.Repository {
    constructor() {
        super(...arguments);
        this.table = "quizs";
        // ${mysql2.escape(stripeId)}
    }
}
exports.QuizRepository = QuizRepository;
//# sourceMappingURL=QuizRepository.js.map