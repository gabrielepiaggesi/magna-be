import { db } from "./connection";
import { Logger } from "./utils/Logger";
const LOG = new Logger("Database.class");

export class Database {
    // tslint:disable-next-line:no-empty
    constructor() {
    }

    public query(query) {
        LOG.debug("executing query...", query);
        return new Promise<any>((resolve, reject) => {
            db.query(query, (error, result, fields) => {
                if (error) { console.log("error 1", error); reject(error); }
                const data = JSON.stringify(result);
                LOG.debug("executed", JSON.parse(data));
                resolve(JSON.parse(data));
            });
        });
    }

    public destroy() {
        db.destroy();
    }
}
