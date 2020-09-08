"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// imports
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const api_1 = __importDefault(require("./integration/api"));
const index_1 = require("./integration/middleware/index");
// initialize
const app = express_1.default();
const port = process.env.PORT || 3000;
// db.connect();
index_1.initMiddlewares(app);
// startConnection();
app.use(cors_1.default());
app.use(body_parser_1.default.json());
app.use(api_1.default);
// start server
app.listen(port, () => {
    return console.log(`server listen on ${port}`);
});
//# sourceMappingURL=app.js.map