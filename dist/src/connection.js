"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = __importDefault(require("mysql"));
const dev_1 = require("../environment/dev/dev");
const pool = mysql_1.default.createPool(dev_1.dev);
const connection = () => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err)
                reject(err);
            console.log("MySQL pool connected: threadId " + connection.threadId);
            const query = (sql, binding) => {
                return new Promise((resolve, reject) => {
                    connection.query(sql, binding, (err, result) => {
                        if (err)
                            reject(err);
                        resolve(result);
                    });
                });
            };
            const newTransaction = () => {
                return new Promise((resolve, reject) => {
                    connection.beginTransaction((err) => {
                        if (err) {
                            this.rollback();
                            reject(false);
                        }
                        else {
                            resolve(true);
                        }
                    });
                });
            };
            const commit = () => {
                return new Promise((resolve, reject) => {
                    connection.commit((err) => {
                        if (err) {
                            this.rollback();
                            reject(false);
                        }
                        else {
                            resolve(true);
                        }
                    });
                });
            };
            const rollback = () => {
                return new Promise((resolve, reject) => {
                    connection.rollback((err) => {
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
            };
            const release = () => {
                return new Promise((resolve, reject) => {
                    if (err)
                        reject(err);
                    console.log("MySQL pool released: threadId " + connection.threadId);
                    resolve(connection.release());
                });
            };
            resolve({ query, release, commit, rollback, newTransaction });
        });
    });
};
module.exports = { pool, connection };
//# sourceMappingURL=connection.js.map