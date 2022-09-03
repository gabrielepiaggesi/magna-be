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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Repository_1 = require("../../framework/repositories/Repository");
const db = require("../../connection");
const mysql2_1 = __importDefault(require("mysql2"));
class TestRepository extends Repository_1.Repository {
    constructor() {
        super(...arguments);
        this.table = "tests";
    }
    // ${mysql2.escape(stripeId)}
    findByQuizId(quizId, conn, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = conn;
            // tslint:disable-next-line:max-line-length
            return c.query(query ||
                `select * from ${this.table} where quiz_id = ${mysql2_1.default.escape(quizId)} and deleted_at is null`)
                .then((results) => results);
        });
    }
    findByQuizIdIn(quizIds, conn, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = conn;
            // tslint:disable-next-line:max-line-length
            return c.query(query ||
                `select * from ${this.table} where quiz_id in (?) and deleted_at is null`, [quizIds])
                .then((results) => results);
        });
    }
    findByQuizIdWithJoin(quizId, conn, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = conn;
            // tslint:disable-next-line:max-line-length
            return c.query(query ||
                `select *, opt.id as option_id, text.id as text_id, img.id as images_id, test.id as test_id 
            from ${this.table} test 
            join tests_texts text on text.test_id = test.id and text.deleted_at is null 
            join tests_options opt on opt.test_id = test.id and opt.deleted_at is null 
            join tests_images img on img.test_id = test.id and img.deleted_at is null 
            where test.quiz_id = ${mysql2_1.default.escape(quizId)} 
            and test.deleted_at is null
            `)
                .then((results) => {
                console.log(results);
                return results;
            });
        });
    }
    findByQuizIdInWithJoin(quizIds, conn, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = conn;
            // tslint:disable-next-line:max-line-length
            return c.query(query ||
                `select *, opt.id as option_id, text.id as text_id, img.id as images_id, test.id as test_id 
            from ${this.table} test 
            join tests_texts text on text.test_id = test.id and text.deleted_at is null 
            join tests_options opt on opt.test_id = test.id and opt.deleted_at is null 
            join tests_images img on img.test_id = test.id and img.deleted_at is null 
            where test.quiz_id in (?) 
            and test.deleted_at is null
            `, [quizIds])
                .then((results) => {
                console.log(results);
                return results;
            });
        });
    }
}
exports.TestRepository = TestRepository;
//# sourceMappingURL=TestRepository.js.map