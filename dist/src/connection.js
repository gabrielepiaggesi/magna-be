"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = __importDefault(require("mysql"));
const dev_1 = require("../environment/dev/dev");
const pool = mysql_1.default.createPool(dev_1.dev);
let dbConnection = pool.getConnection((err, connection) => {
    console.log("...");
    if (err) {
        console.log("error when connecting to db:", err);
        throw err;
    }
    console.log("connection estabilished");
    return connection;
});
console.log("connection...");
// export const initConnection = (app) => {
//     this.auth = new AuthMiddleWare();
//     app.use(this.auth.init());
// };
exports.startConnection = () => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.log("error when connecting to db:", err);
            throw err;
        }
        if (dbConnection) {
            try {
                dbConnection.release();
            }
            catch (e) {
                console.log("impossible to release connection", e);
            }
        }
        dbConnection = connection;
        console.log("connected!");
        exports.startErrorListener();
    });
};
exports.startErrorListener = () => {
    dbConnection.on("error", (err) => {
        console.log("db error", err, err.code);
        if (dbConnection) {
            try {
                dbConnection.release();
            }
            catch (e) {
                console.log("impossible to release connection", e);
            }
        }
        exports.startConnection();
    });
};
exports.startConnection();
// startErrorListener();
// dbConnection.connect((err) => {
//     if (err) {
//         console.log("error when connecting to db:", err);
//         // setTimeout(this.dbConnection = mysql.createConnection(dev), 2000);
//     } else {
//         console.log("connected!");
//     }
// });
// dbConnection.on("error", (err) => {
// console.log("db error", err, err.code);
// if (err.fatal) {
//     console.trace('fatal error: ' + err.message);
// }
// if (err.code === "PROTOCOL_CONNECTION_LOST") {
//     try {
//         dbConnection.release();
//     } catch(e) { console.log("impossible to release connection", e);}
//     startConnection();
// } else {
//     console.trace('error: ' + err.message);
//     throw err;
// }
// });
module.exports = dbConnection;
// export const newTransaction = () => {
//     return new Promise<any>((resolve, reject) => {
//         this.dbConnection.beginTransaction((err) => {
//             if (err) {
//                 this.rollback();
//                 reject(false);
//             } else {
//                 resolve(true);
//             }
//         });
//     });
// };
// export const commit = () => {
//     return new Promise<any>((resolve, reject) => {
//         this.dbConnection.commit((err) => {
//             if (err) {
//                 this.rollback();
//                 reject(false);
//             } else {
//                 this.dbConnection.release();
//                 resolve(true);
//             }
//         });
//     });
// };
// export const rollback = () => {
//     return new Promise<any>((resolve, reject) => {
//         this.dbConnection.rollback(() => {
//             try {
//                 this.dbConnection.release();
//                 this.dbConnection.end();
//                 resolve(true);
//             } catch (e) {
//                 console.log("Rollback Error: ", e);
//                 reject(false);
//                 throw e;
//             }
//         });
//     });
// };
// export const db = dbConnection;
//# sourceMappingURL=connection.js.map