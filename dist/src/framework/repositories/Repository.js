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
    save(model, conn) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = conn;
            const insert = this.queryBuilder.save(model, this.table);
            return yield c.query(insert);
        });
    }
    saveMultiple(keys, values, conn) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = conn;
            const insert = `INSERT INTO ${this.table} (${keys.join(',')}) VALUES ?`;
            // var keys = [
            //     ['demian', 'demian@gmail.com', 1],
            //     ['john', 'john@gmail.com', 2],
            //     ['mark', 'mark@gmail.com', 3],
            //     ['pete', 'pete@gmail.com', 4]
            // ];
            // var values = [
            //     ['demian', 'demian@gmail.com', 1],
            //     ['john', 'john@gmail.com', 2],
            //     ['mark', 'mark@gmail.com', 3],
            //     ['pete', 'pete@gmail.com', 4]
            // ];
            // conn.query(sql, [values], function(err) {
            //     if (err) throw err;
            //     conn.end();
            // });
            return yield c.query(insert, [values]);
        });
    }
    update(model, conn) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = conn;
            // tslint:disable-next-line:no-string-literal
            const id = model["id"];
            const update = this.queryBuilder.update(model, id, this.table);
            return yield c.query(update);
        });
    }
    delete(model, conn) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = conn;
            // tslint:disable-next-line:no-string-literal
            const id = model["id"];
            model['deleted_at'] = new Date(Date.now()).toISOString().substring(0, 19).replace("T", " ");
            const d = this.queryBuilder.update(model, id, this.table);
            return yield c.query(d);
        });
    }
    findAll(query = null, conn) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = conn;
            return yield c.query(query || `select * from ${this.table} limit 1000`);
        });
    }
    findAllActive(query = null, conn) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = conn;
            return yield c.query(query || `select * from ${this.table} where deleted_at is null limit 1000`);
        });
    }
    findById(id, conn, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = conn;
            // tslint:disable-next-line:max-line-length
            return yield c.query(query || `select * from ${this.table} where id = ${id} limit 1`).then((results) => results[0]);
        });
    }
}
exports.Repository = Repository;
//# sourceMappingURL=Repository.js.map