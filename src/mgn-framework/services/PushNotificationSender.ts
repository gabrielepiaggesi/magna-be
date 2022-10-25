import { Logger } from "./Logger";
import { GeneralRepository } from "../repositories/GeneralRepository";
const request = require('request');
const db = require("../../connection");

const LOG = new Logger("PushNotificationSender.class");

export class PushNotificationSender {

    public static sendToUser(userId: number, title: string, msg: string, type = 'general') {
        this.send({
            app_id: process.env.ONESIGNAL_APP_ID,
            android_channel_id: '87068eb6-ac5b-411c-9006-07090917b28c',
            include_external_user_ids: [userId+''],
            channel_for_external_user_ids: "push",
            name: type,
            contents: {
                en: msg,
                it: msg,
            },
            headings: {
                en: title,
                it: title,
            }
        });
    }

    public static sendToUsers(userIds: number[], title: string, msg: string, type = 'general') {
        const userIdsString = userIds.map(id => id+'');
        this.send({
            app_id: process.env.ONESIGNAL_APP_ID,
            android_channel_id: '87068eb6-ac5b-411c-9006-07090917b28c',
            include_external_user_ids: userIdsString,
            channel_for_external_user_ids: "push",
            name: type,
            contents: {
                en: msg,
                it: msg,
            },
            headings: {
                en: title,
                it: title,
            }
        });
    }

    public static sendToClients(businessId: number, title: string, msg: string, type = 'general') {
        this.send({
            app_id: process.env.ONESIGNAL_APP_ID,
            android_channel_id: '87068eb6-ac5b-411c-9006-07090917b28c',
            name: type,
            contents: {
                en: msg,
                it: msg,
            },
            headings: {
                en: title,
                it: title,
            },
            filters: [
                { field: "tag", key: "business_id_"+businessId, relation: "=", value: businessId }
            ]
        });
    }

    private static send(body) {

        var options = {
            'method': 'POST',
            'url': 'https://onesignal.com/api/v1/notifications',
            'headers': {
              'Authorization': 'Basic ' + process.env.ONESIGNAL_API_KEY, // heroku config:set GITHUB_USERNAME=joesmith
              'accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        };
        request(options, (error, response, body) => {
            if (error) {
                LOG.error(error);
                LOG.error(response);
            }
            LOG.debug(options);
            LOG.debug(body);
        });
    }
}