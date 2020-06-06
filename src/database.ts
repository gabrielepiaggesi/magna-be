// import { db } from "./connection";
import { Logger } from "./utils/Logger";
const LOG = new Logger("Database.class");
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

module.exports.query = async function (query) {
    LOG.debug("executing query...", query);
    return new Promise<any>(async (resolve, reject) => {
        await db.query(query, (error, result, fields) => {
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

module.exports.destroy = async function () {
    await db.destroy();
}

module.exports.newTransaction = async function () {
    return new Promise<any>(async (resolve, reject) => {
        await db.beginTransaction((err) => {
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

module.exports.commit = async function () {
    return new Promise<any>(async (resolve, reject) => {
        await db.commit((err) => {
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

module.exports.rollback = async function () {
    return new Promise<any>(async (resolve, reject) => {
        await db.rollback((err) => {
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
