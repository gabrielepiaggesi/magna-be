"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const connection_1 = require("./connection");
const UserService_1 = require("./services/UserService");
// initialize
const app = express_1.default();
const port = 3000;
connection_1.connect();
app.use(body_parser_1.default.json());
const userService = new UserService_1.UserService();
app.get("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield userService.getUsers(res); }));
app.get("/users/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield userService.getUser(res, parseInt(req.params.id, 10)); }));
app.post("/users/create", (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield userService.createUser(res, req.body); }));
// start server
app.listen(port, (err) => {
    if (err) {
        return console.error(err);
    }
    return console.log(`server listen on ${port}`);
});
//# sourceMappingURL=app.js.map