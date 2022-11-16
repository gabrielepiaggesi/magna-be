export class Logger {
    public classString;

    constructor(public className) {
        this.classString = className;
    }

    public debug = (text: any = "", params: any = "") => console.log("DEBUG: " + this.className + " - ", text, params);
    public warn = (text = "", params: any = "") => console.log('\x1b[33m%s\x1b[0m',"WARN: " + this.className + " - ", text, params);
    public info = (text = "", params: any = "") => console.log('\x1b[36m%s\x1b[0m', "INFO: " + this.className + " - ", text, params);
    public error = (text = "", params: any = "") => console.log('\x1b[31m%s\x1b[0m', "ERROR: " + this.className + " - ", text, params);
}
