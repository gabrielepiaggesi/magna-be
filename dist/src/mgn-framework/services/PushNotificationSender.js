"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = require("./Logger");
const request = require('request');
const db = require("../../connection");
const LOG = new Logger_1.Logger("PushNotificationSender.class");
class PushNotificationSender {
    static sendToUser(userId, msg) {
        this.send(userId, msg);
    }
    static send(userId, message, params = {}) {
        var options = {
            'method': 'POST',
            'url': 'https://onesignal.com/api/v1/notifications',
            'headers': {
                'Authorization': 'Basic ' + process.env.ONESIGNAL_API_KEY,
                'accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                app_id: process.env.ONESIGNAL_APP_ID,
                include_external_user_ids: [userId + ''],
                channel_for_external_user_ids: "push",
                contents: {
                    en: message,
                    it: message,
                }
            })
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