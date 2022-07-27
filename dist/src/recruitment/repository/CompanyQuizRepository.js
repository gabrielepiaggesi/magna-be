"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Repository_1 = require("../../framework/repositories/Repository");
const db = require("../../connection");
class CompanyQuizRepository extends Repository_1.Repository {
    constructor() {
        super(...arguments);
        this.table = "companies_quizs";
        // ${mysql2.escape(stripeId)}
    }
}
exports.CompanyQuizRepository = CompanyQuizRepository;
//# sourceMappingURL=CompanyQuizRepository.js.map