"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = __importDefault(require("mysql"));
const dev_1 = require("../environment/dev");
const dbConnection = mysql_1.default.createConnection(dev_1.dev);
exports.connect = () => {
    this.dbConnection = mysql_1.default.createConnection(dev_1.dev);
    console.log("connection...");
    this.dbConnection.connect((err) => {
        if (err) {
            console.log("error when connecting to db:", err);
            setTimeout(this.dbConnection = mysql_1.default.createConnection(dev_1.dev), 2000);
        }
        else {
            console.log("connected!");
        }
    });
    this.dbConnection.on("error", (err) => {
        console.log("db error", err.code);
        if (err.code === "PROTOCOL_CONNECTION_LOST") {
            this.dbConnection = mysql_1.default.createConnection(dev_1.dev);
        }
        else {
            throw err;
        }
    });
};
exports.db = dbConnection;
//# sourceMappingURL=connection.js.map