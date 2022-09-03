"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// imports
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const api_1 = __importDefault(require("./api"));
const _1 = require(".");
const cron_1 = require("./cron");
process.env['SENDINBLUE_API_KEY'] = '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';
process.on('uncaughtException', function (err) {
    console.log('Caught exception: ', err);
});
// initialize
const app = express_1.default();
const port = process.env.PORT || 8000;
// db.connect();
_1.initMiddlewares(app);
// startConnection();
// init all crons/jobs
cron_1.initJobs(app);
app.use(cors_1.default());
app.use(body_parser_1.default.json());
app.use(api_1.default);
// start server
app.listen(port, () => {
    return console.log(`server listen on ${port}`);
});
//# sourceMappingURL=app.js.map