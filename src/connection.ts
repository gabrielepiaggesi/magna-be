import mysql from "mysql";
import { dev } from "../environment/dev/dev";

const pool = mysql.createPool(dev);
const connection = () => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) reject(err);
            console.log("MySQL pool connected: threadId " + connection.threadId);
            const query = (sql, binding) => {
                return new Promise((resolve, reject) => {
                    connection.query(sql, binding, (err, result) => {
                        if (err) reject(err);
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
                        } else {
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
                        } else {
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
                        } else {
                            resolve(true);
                        }
                    });
                });
            };
            const release = () => {
                return new Promise((resolve, reject) => {
                    if (err) reject(err);
                    console.log("MySQL pool released: threadId " + connection.threadId);
                    resolve(connection.release());
                });
            };
            resolve({ query, release, commit, rollback, newTransaction });
        });
    });
};

module.exports = { pool, connection };
