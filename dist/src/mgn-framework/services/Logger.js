"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Logger {
    constructor(className) {
        this.className = className;
        this.debug = (text = "", params = "") => console.log("DEBUG: " + this.className + " - ", text, params);
        this.warn = (text = "", params = "") => console.log('\x1b[33m%s\x1b[0m', "WARN: " + this.className + " - ", text, params);
        this.info = (text = "", params = "") => console.log('\x1b[36m%s\x1b[0m', "INFO: " + this.className + " - ", text, params);
        this.error = (text = "", params = "") => console.log('\x1b[31m%s\x1b[0m', "ERROR: " + this.className + " - ", text, params);
        this.classString = className;
    }
}
exports.Logger = Logger;
//# sourceMappingURL=Logger.js.map