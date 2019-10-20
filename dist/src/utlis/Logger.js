"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Logger {
    constructor(className) {
        this.className = className;
        this.debug = (text = "", params = "") => console.log("DEBUG: " + this.className + " - ", text, params);
        this.warn = (text = "", params = "") => console.log("WARN: " + this.className + " - ", text, params);
        this.info = (text = "", params = "") => console.log("INFO: " + this.className + " - ", text, params);
        this.error = (text = "", params = "") => console.log("ERROR: " + this.className + " - ", text, params);
        this.classString = className;
    }
}
exports.Logger = Logger;
//# sourceMappingURL=Logger.js.map