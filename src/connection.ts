import mysql from "mysql";
import { dev } from "../environment/dev/dev";

const dbConnection = mysql.createConnection(dev);

export const connect = () => {
    this.dbConnection = mysql.createConnection(dev);
    console.log("connection...");
    this.dbConnection.connect((err) => {
        if (err) {
            console.log("error when connecting to db:", err);
            setTimeout(this.dbConnection = mysql.createConnection(dev), 2000);
        } else {
            console.log("connected!");
        }
    });
    this.dbConnection.on("error", (err) => {
        console.log("db error", err.code);
        if (err.code === "PROTOCOL_CONNECTION_LOST") {
            this.dbConnection = mysql.createConnection(dev);
        } else {
            throw err;
        }
    });
};

export const db = dbConnection;
