"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// imports
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_1 = __importDefault(require("express"));
const api_1 = __importDefault(require("./framework/integrations/api"));
const middleware_1 = require("./framework/integrations/middleware");
const jwt_1 = require("../environment/dev/jwt");
// initialize
const app = express_1.default();
const port = process.env.PORT || 3000;
// db.connect();
middleware_1.initMiddlewares(app);
// startConnection();
app.use(cors_1.default());
app.use(body_parser_1.default.json());
app.use(api_1.default);
app.use(function (req, res, next) {
    var authorization = req.headers.authorization.split(' ')[1], decoded;
    decoded = jsonwebtoken_1.default.verify(authorization, jwt_1.jwtConfig.secretOrKey);
    var userId = decoded.id;
    res.locals.user = userId;
    next();
});
// start server
app.listen(port, () => {
    return console.log(`server listen on ${port}`);
});
//# sourceMappingURL=app.js.map