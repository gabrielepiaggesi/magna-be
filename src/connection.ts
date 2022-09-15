import mysql2 from "mysql2";
import { dev } from "../env/dev/dev";
import { Logger } from "./mgn-framework/services/Logger";

const LOG = new Logger("DB");
const pool = mysql2.createPool(dev);
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
                    connection.rollback(() => {
                        console.log("Rollback!");
                        resolve(true);
                    });
                });
            };
            const release = () => {
                return new Promise((resolve, reject) => {
                    if (err) reject(err);
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

const attemptConnection = () =>
  pool.getConnection((err, connection) => {
  if (err) {
    LOG.error('error connecting. retrying in 1 sec');
    setTimeout(attemptConnection, 1000);
  } else {
    connection.query(sql, (errQuery, results) => {
      connection.release();
      if (errQuery) {
        LOG.error('Error querying database!');
      } else {
        LOG.info('DATABASE READY');
      }
    });
  }
});

attemptConnection();
