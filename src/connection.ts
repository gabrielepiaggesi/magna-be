import mysql from "mysql";
import { dev } from "../environment/dev/dev";

const dbConnection = mysql.createConnection(dev);

console.log("connection...");
dbConnection.connect((err) => {
    if (err) {
        console.log("error when connecting to db:", err);
        // setTimeout(this.dbConnection = mysql.createConnection(dev), 2000);
    } else {
        console.log("connected!");
    }
});
dbConnection.on("error", (err) => {
    console.log("db error", err.code);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
        this.dbConnection = mysql.createConnection(dev);
    } else {
        throw err;
    }
});

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

export const db = dbConnection;
