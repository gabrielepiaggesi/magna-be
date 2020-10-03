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
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const db = require("../../connection");
class Repository {
    constructor() {
        this.queryBuilder = new QueryBuilder_1.QueryBuilder();
        this.table = "";
    }
    save(model, conn = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = conn;
            const insert = this.queryBuilder.save(model, this.table);
            return yield c.query(insert);
        });
    }
    update(model, conn = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = conn;
            // tslint:disable-next-line:no-string-literal
            const id = model["id"];
            const update = this.queryBuilder.update(model, id, this.table);
            return yield c.query(update);
        });
    }
    delete(model, conn = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = conn;
            // tslint:disable-next-line:no-string-literal
            const id = model["id"];
            model['deleted_at'] = new Date(Date.now()).toISOString().substring(0, 19).replace("T", " ");
            const d = this.queryBuilder.update(model, id, this.table);
            return yield c.query(d);
        });
    }
    findAll(query = null, conn = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = conn;
            return yield c.query(query || `select * from ${this.table} limit 1000`);
        });
    }
    findById(id, conn = null, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = conn;
            // tslint:disable-next-line:max-line-length
            return yield c.query(query || `select * from ${this.table} where id = ${id} limit 1`).then((results) => results[0]);
        });
    }
}
exports.Repository = Repository;
//# sourceMappingURL=Repository.js.map