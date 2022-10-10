"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = require("./Logger");
const request = require('request');
const db = require("../../connection");
const LOG = new Logger_1.Logger("PushNotificationSender.class");
class PushNotificationSender {
    static sendToUser(userId, title, msg) {
        this.send({
            app_id: process.env.ONESIGNAL_APP_ID,
            android_channel_id: '87068eb6-ac5b-411c-9006-07090917b28c',
            include_external_user_ids: [userId + ''],
            channel_for_external_user_ids: "push",
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
    static sendToUsers(userIds, title, msg) {
        const userIdsString = userIds.map(id => id + '');
        this.send({
            app_id: process.env.ONESIGNAL_APP_ID,
            android_channel_id: '87068eb6-ac5b-411c-9006-07090917b28c',
            include_external_user_ids: userIdsString,
            channel_for_external_user_ids: "push",
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
    static sendToClients(businessId, title, msg) {
        this.send({
            app_id: process.env.ONESIGNAL_APP_ID,
            android_channel_id: '87068eb6-ac5b-411c-9006-07090917b28c',
            contents: {
                en: msg,
                it: msg,
            },
            headings: {
                en: title,
                it: title,
            },
            filters: [
                { field: "tag", key: "business_id_" + businessId, relation: "=", value: businessId }
            ]
        });
    }
    static send(body) {
        var options = {
            'method': 'POST',
            'url': 'https://onesignal.com/api/v1/notifications',
            'headers': {
                'Authorization': 'Basic ' + process.env.ONESIGNAL_API_KEY,
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
exports.PushNotificationSender = PushNotificationSender;
//# sourceMappingURL=PushNotificationSender.js.map