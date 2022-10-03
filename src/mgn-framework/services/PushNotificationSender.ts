import { Logger } from "./Logger";
import { GeneralRepository } from "../repositories/GeneralRepository";
const request = require('request');
const db = require("../../connection");

const LOG = new Logger("PushNotificationSender.class");

export class PushNotificationSender {

    public static sendToUser(userId: number, msg: string) {
        this.send(userId, msg);
    }

    private static send(userId: number, message: string, params = {}) {

        var options = {
            'method': 'POST',
            'url': 'https://onesignal.com/api/v1/notifications',
            'headers': {
              'Authorization': 'Basic ' + process.env.ONESIGNAL_API_KEY, // heroku config:set GITHUB_USERNAME=joesmith
              'accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    app_id: process.env.ONESIGNAL_APP_ID,
                    include_external_user_ids: [userId+''],
                    channel_for_external_user_ids: "push",
                    contents: {
                        en: message,
                        it: message,
                    }
                }
            )
          
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