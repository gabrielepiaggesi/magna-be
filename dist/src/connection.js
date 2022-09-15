"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql2_1 = __importDefault(require("mysql2"));
const dev_1 = require("../env/dev/dev");
const Logger_1 = require("./mgn-framework/services/Logger");
const LOG = new Logger_1.Logger("DB");
const pool = mysql2_1.default.createPool(dev_1.dev);
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
                    connection.rollback(() => {
                        console.log("Rollback!");
                        resolve(true);
                    });
                });
            };
            const release = () => {
                return new Promise((resolve, reject) => {
                    if (err)
                        reject(err);
                    console.log("MySQL connection released to the pool: threadId " + connection.threadId + " ready for reuse");
                    resolve(connection.release());
                });
            };
            resolve({ query, release, commit, rollback, newTransaction });
        });
    });
};
module.exports = { pool, connection };
const sql = 'SELECT 1;';
const attemptConnection = () => pool.getConnection((err, connection) => {
    if (err) {
        LOG.error('error connecting. retrying in 1 sec');
        setTimeout(attemptConnection, 1000);
    }
    else {
        connection.query(sql, (errQuery, results) => {
            connection.release();
            if (errQuery) {
                LOG.error('Error querying database!');
            }
            else {
                LOG.info('DATABASE READY');
            }
        });
    }
});
attemptConnection();
//# sourceMappingURL=connection.js.map