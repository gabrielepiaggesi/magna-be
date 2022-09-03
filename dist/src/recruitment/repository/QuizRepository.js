"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Repository_1 = require("../../framework/repositories/Repository");
const db = require("../../connection");
class QuizRepository extends Repository_1.Repository {
    constructor() {
        super(...arguments);
        this.table = "quizs";
    }
    // ${mysql2.escape(stripeId)}
    findWhereIdIn(quizIds, conn = null, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!quizIds.length)
                return [];
            const c = conn || (yield db.connection());
            return c.query(query ||
                `select * 
            from ${this.table} 
            where deleted_at is null and id in (?) order by id desc`, [quizIds]).then((results) => results);
        });
    }
}
exports.QuizRepository = QuizRepository;
//# sourceMappingURL=QuizRepository.js.map