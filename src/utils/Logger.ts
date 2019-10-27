export class Logger {
    public classString;

    constructor(public className) {
        this.classString = className;
    }

    public debug = (text: any = "", params: any = "") => console.log("DEBUG: " + this.className + " - ", text, params);
    public warn = (text = "", params = "") => console.log("WARN: " + this.className + " - ", text, params);
    public info = (text = "", params = "") => console.log("INFO: " + this.className + " - ", text, params);
    public error = (text = "", params = "") => console.log("ERROR: " + this.className + " - ", text, params);
}
