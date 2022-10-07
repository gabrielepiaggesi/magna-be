import { Logger } from "./Logger";
import { GeneralRepository } from "../repositories/GeneralRepository";
const request = require('request');
const db = require("../../connection");

const LOG = new Logger("EmailSender.class");
const genRepository = new GeneralRepository();

export class EmailSender {

    public static sendSpecificEmail(emailDto) {
        this.send(emailDto.templateId, emailDto.email, emailDto.params);
    }

    public static sendWelcomeMessage(emailDto) {
        this.send(1, emailDto.email);
    }

    public static sendRetentionMessage(emailDto) {
        this.send(2, emailDto.email);
    }

    public static sendNewMemberMessage(emailDto) {
        this.send(3, emailDto.email, emailDto.params);
    }

    public static sendNewRenewMessage(emailDto) {
        this.send(4, emailDto.email, emailDto.params);
    }

    public static sendSubCanceled(emailDto) {
        this.send(5, emailDto.email);
    }

    public static async sendRetentionEmail() {
        const fromDayAgo = 4;
        const toDayAgo = 3;

        const connection = await db.connection();
        const users = await genRepository.findUsersToCall(fromDayAgo, toDayAgo, connection);
        await connection.release();
        LOG.debug("retention email users size", users.length);

        for (let i = 0; i < users.length; i++) {
            const us = users[i];
            LOG.debug("sending retention email to", us.email);
            try {
                this.send(2, us.email);
                LOG.debug("done");
            } catch (e) {
                LOG.error("sendRetentionEmail", e);
            }
            await this.sleep(1000);
        }

        return true;
    }

    private static async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private static send(templateId: number, email: string, params = {}) {

        var options = {
            'method': 'POST',
            'url': 'https://api.sendinblue.com/v3/smtp/email',
            'headers': {
              'api-key': process.env.SENDINBLUE_API_KEY, // heroku config:set GITHUB_USERNAME=joesmith
              'accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sender: { email: 'comebackwebapp@gmail.com', name: 'COMEBACK APP' },
                to: [{ email: email }],
                replyTo: { email: 'comebackwebapp@gmail.com' },
                params: { default: 'ciao', ...params },
                templateId: templateId
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