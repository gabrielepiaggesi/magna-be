"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = require("./connection");
const Logger_1 = require("./utlis/Logger");
const LOG = new Logger_1.Logger("Database.class");
class Database {
    // tslint:disable-next-line:no-empty
    constructor() {
    }
    query(query) {
        LOG.debug("executing query...", query);
        return new Promise((resolve, reject) => {
            connection_1.db.query(query, (error, result, fields) => {
                if (error) {
                    console.log("error 1", error);
                    reject(error);
                }
                const data = JSON.stringify(result);
                LOG.debug("executed", JSON.parse(data));
                resolve(JSON.parse(data));
            });
        });
    }
    destroy() {
        connection_1.db.destroy();
    }
}
exports.Database = Database;
//# sourceMappingURL=database.js.map