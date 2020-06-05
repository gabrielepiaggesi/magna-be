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
// import { db } from "./connection";
const Logger_1 = require("./utils/Logger");
const LOG = new Logger_1.Logger("Database.class");
const db = require("./connection");
// export class Database {
//     // tslint:disable-next-line:no-empty
//     constructor() {
//     }
//     public query(query) {
//         LOG.debug("executing query...", query);
//         return new Promise<any>((resolve, reject) => {
//             db.query(query, (error, result, fields) => {
//                 if (error) {
//                     console.log("error 1", error); reject(error);
//                 } else {
//                     const data = JSON.stringify(result);
//                     LOG.debug("executed");
//                     resolve(JSON.parse(data));
//                 }
//             });
//         });
//     }
//     public destroy() {
//         db.destroy();
//     }
//     public newTransaction() {
//         return new Promise<any>((resolve, reject) => {
//             db.beginTransaction((err) => {
//                 LOG.debug("beginTransaction...");
//                 if (err) {
//                     this.rollback();
//                     reject(false);
//                 } else {
//                     resolve(true);
//                 }
//             });
//         });
//     }
//     public commit() {
//         return new Promise<any>((resolve, reject) => {
//             db.commit((err) => {
//                 LOG.debug("commit...");
//                 if (err) {
//                     this.rollback();
//                     reject(false);
//                 } else {
//                     resolve(true);
//                 }
//             });
//         });
//     }
//     public rollback() {
//         return new Promise<any>((resolve, reject) => {
//             db.rollback((err) => {
//                 LOG.debug("rollback...");
//                 if (err) {
//                     console.log("Rollback Error: ", err);
//                     reject(false);
//                     throw err;
//                 } else {
//                     resolve(true);
//                 }
//             });
//         });
//     }
// }
module.exports.query = function (query) {
    return __awaiter(this, void 0, void 0, function* () {
        LOG.debug("executing query...", query);
        return new Promise((resolve, reject) => {
            db.query(query, (error, result, fields) => {
                if (error) {
                    console.log("error 1", error);
                    reject(error);
                }
                else {
                    const data = JSON.stringify(result);
                    LOG.debug("executed");
                    resolve(JSON.parse(data));
                }
            });
        });
    });
};
module.exports.destroy = function () {
    return __awaiter(this, void 0, void 0, function* () {
        db.destroy();
    });
};
module.exports.newTransaction = function () {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            db.beginTransaction((err) => {
                LOG.debug("beginTransaction...");
                if (err) {
                    this.rollback();
                    reject(false);
                }
                else {
                    resolve(true);
                }
            });
        });
    });
};
module.exports.commit = function () {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            db.commit((err) => {
                LOG.debug("commit...");
                if (err) {
                    this.rollback();
                    reject(false);
                }
                else {
                    resolve(true);
                }
            });
        });
    });
};
module.exports.rollback = function () {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            db.rollback((err) => {
                LOG.debug("rollback...");
                if (err) {
                    console.log("Rollback Error: ", err);
                    reject(false);
                    throw err;
                }
                else {
                    resolve(true);
                }
            });
        });
    });
};
//# sourceMappingURL=database.js.map