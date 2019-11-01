"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = require("./connection");
const Logger_1 = require("./utils/Logger");
const LOG = new Logger_1.Logger("Database.class");
class Database {
    // tslint:disable-next-line:no-empty
    constructor() {
        this.db = connection_1.db;
    }
    query(query) {
        LOG.debug("executing query...", query);
        return new Promise((resolve, reject) => {
            this.db.query(query, (error, result, fields) => {
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
    }
    destroy() {
        this.db.destroy();
    }
    newTransaction() {
        return new Promise((resolve, reject) => {
            this.db.beginTransaction((err) => {
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
    }
    commit() {
        return new Promise((resolve, reject) => {
            this.db.commit((err) => {
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
    }
    rollback() {
        return new Promise((resolve, reject) => {
            this.db.rollback((err) => {
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
    }
}
exports.Database = Database;
//# sourceMappingURL=database.js.map