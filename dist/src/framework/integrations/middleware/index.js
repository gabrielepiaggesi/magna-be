"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AuthMiddleWare_1 = require("./AuthMiddleWare");
exports.auth = new AuthMiddleWare_1.AuthMiddleWare();
exports.initMiddlewares = (app) => {
    this.auth = new AuthMiddleWare_1.AuthMiddleWare();
    app.use(this.auth.init());
};
//# sourceMappingURL=index.js.map