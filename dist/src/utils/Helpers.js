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
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
var moment = require('moment');
function getDatesDiffIn(dateBefore, dateAfter, time) {
    const date1 = new Date(dateBefore);
    let date2 = new Date(dateAfter);
    var a = moment([date2.getFullYear(), date2.getMonth(), date2.getDay()]);
    var b = moment([date1.getFullYear(), date1.getMonth(), date1.getDay()]);
    return a.diff(b, time);
}
exports.getDatesDiffIn = getDatesDiffIn;
function routeFromController(object) {
    const route = express_1.default.Router();
    const targetController = object.constructor.prototype;
    const functionKeys = Object.getOwnPropertyNames(targetController);
    functionKeys.filter(key => key !== 'constructor' && Reflect.getMetadata('METHOD', targetController, key) && Reflect.getMetadata('PATH', targetController, key)).forEach(fn => {
        const method = Reflect.getMetadata('METHOD', targetController, fn);
        const path = Reflect.getMetadata('PATH', targetController, fn);
        const multerConfig = Reflect.getMetadata('MULTER', targetController, fn) || null;
        if (method === "POST")
            multerConfig ?
                route.post(path, (!multerConfig.type || multerConfig.type === 'single') ?
                    multer_1.default(multerConfig.config).single(multerConfig.path || 'file') :
                    multer_1.default(multerConfig.config).any(), (req, res) => __awaiter(this, void 0, void 0, function* () { return yield object[fn](res, req); })) :
                route.post(path, (req, res) => __awaiter(this, void 0, void 0, function* () { return yield object[fn](res, req); }));
        if (method === "GET")
            route.get(path, (req, res) => __awaiter(this, void 0, void 0, function* () { return yield object[fn](res, req); }));
        if (method === "PUT")
            route.put(path, (req, res) => __awaiter(this, void 0, void 0, function* () { return yield object[fn](res, req); }));
        if (method === "DELETE")
            route.delete(path, (req, res) => __awaiter(this, void 0, void 0, function* () { return yield object[fn](res, req); }));
        if (method === "PATCH")
            route.patch(path, (req, res) => __awaiter(this, void 0, void 0, function* () { return yield object[fn](res, req); }));
    });
    return route;
}
exports.routeFromController = routeFromController;
function isDateBeforeToday(date) {
    if (!date)
        return false;
    // new Date(Date.now()).toLocaleString('sv', {timeZone: 'Europe/Rome'});
    return new Date(date).toLocaleString('sv', { timeZone: 'Europe/Rome' }) < new Date(Date.now()).toLocaleString('sv', { timeZone: 'Europe/Rome' });
}
exports.isDateBeforeToday = isDateBeforeToday;
function isDateToday(date) {
    if (!date)
        return false;
    // new Date(Date.now()).toLocaleString('sv', {timeZone: 'Europe/Rome'});
    return date.substring(0, 10) == new Date(Date.now()).toLocaleString('sv', { timeZone: 'Europe/Rome' }).substring(0, 10);
}
exports.isDateToday = isDateToday;
//# sourceMappingURL=Helpers.js.map