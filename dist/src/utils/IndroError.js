"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class IndroError extends Error {
    constructor(msg, status = 500, code = null, e = undefined) {
        super(msg);
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
        this.status = status;
        this.message = msg;
        this.code = code;
        this.error = e;
    }
}
exports.IndroError = IndroError;
//# sourceMappingURL=IndroError.js.map