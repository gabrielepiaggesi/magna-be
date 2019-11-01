import { db } from "./connection";
import { Logger } from "./utils/Logger";
const LOG = new Logger("Database.class");

export class Database {
    public db = db;
    // tslint:disable-next-line:no-empty
    constructor() {
    }

    public query(query) {
        LOG.debug("executing query...", query);
        return new Promise<any>((resolve, reject) => {
            this.db.query(query, (error, result, fields) => {
                if (error) {
                    console.log("error 1", error); reject(error);
                } else {
                    const data = JSON.stringify(result);
                    LOG.debug("executed");
                    resolve(JSON.parse(data));
                }
            });
        });
    }

    public destroy() {
        this.db.destroy();
    }

    public newTransaction() {
        return new Promise<any>((resolve, reject) => {
            this.db.beginTransaction((err) => {
                LOG.debug("beginTransaction...");
                if (err) {
                    this.rollback();
                    reject(false);
                } else {
                    resolve(true);
                }
            });
        });
    }

    public commit() {
        return new Promise<any>((resolve, reject) => {
            this.db.commit((err) => {
                LOG.debug("commit...");
                if (err) {
                    this.rollback();
                    reject(false);
                } else {
                    resolve(true);
                }
            });
        });
    }

    public rollback() {
        return new Promise<any>((resolve, reject) => {
            this.db.rollback((err) => {
                LOG.debug("rollback...");
                if (err) {
                    console.log("Rollback Error: ", err);
                    reject(false);
                    throw err;
                } else {
                    resolve(true);
                }
            });
        });
    }
}
