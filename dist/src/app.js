"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// imports
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const api_1 = __importDefault(require("./framework/integrations/api"));
const middleware_1 = require("./framework/integrations/middleware");
const cron_1 = require("./cron");
// initialize
const app = express_1.default();
const port = process.env.PORT || 3000;
// db.connect();
middleware_1.initMiddlewares(app);
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