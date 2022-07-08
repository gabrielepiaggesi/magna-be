import express, { Router } from "express";
var moment = require('moment');

export function getDatesDiffIn(dateBefore: string|Date|number, dateAfter: string|Date|number, time: 'years' | 'weeks' | 'days' | 'months') {
    const date1 = new Date(dateBefore);
    let date2 = new Date(dateAfter);
    var a = moment([date2.getFullYear(), date2.getMonth(), date2.getDay()]);
    var b = moment([date1.getFullYear(), date1.getMonth(), date1.getDay()]);
    return a.diff(b, time);
}

export function routeFromController(object: any): Router {
    const route = express.Router();
    const targetController = object.constructor.prototype;
    const functionKeys = Object.getOwnPropertyNames(targetController);
  
    functionKeys.filter(key => key !== 'constructor' && Reflect.getMetadata('METHOD', targetController, key) && Reflect.getMetadata('PATH', targetController, key)).forEach(fn => {
        const method = Reflect.getMetadata('METHOD', targetController, fn);
        const path = Reflect.getMetadata('PATH', targetController, fn);

        if (method === "POST") route.post(path, async (req, res) => await object[fn](res, req));
        if (method === "GET") route.get(path, async (req, res) => await object[fn](res, req));
        if (method === "PUT") route.put(path, async (req, res) => await object[fn](res, req));
        if (method === "DELETE") route.delete(path, async (req, res) => await object[fn](res, req));
        if (method === "PATCH") route.patch(path, async (req, res) => await object[fn](res, req));
    });
    return route;
}
