"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// imports
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const connection_1 = require("./connection");
const api_1 = __importDefault(require("./integration/api"));
const index_1 = require("./integration/middleware/index");
// initialize
const app = express_1.default();
const port = 3000;
connection_1.connect();
index_1.initMiddlewares(app);
app.use(body_parser_1.default.json());
app.use(api_1.default);
// start server
app.listen(port, (err) => {
    if (err) {
        return console.error(err);
    }
    return console.log(`server listen on ${port}`);
});
//# sourceMappingURL=app.js.map