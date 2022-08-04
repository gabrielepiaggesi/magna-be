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
        const options = {
            method: 'POST',
            url: 'https://api.sendinblue.com/v3/smtp/email',
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json',
                'api-key': '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'
            },
            body: {
                sender: { email: 'indrowebapp@gmail.com', name: 'INDRO JOB' },
                to: [{ email: email }],
                replyTo: { email: 'indrowebapp@gmail.com' },
                params: { default: 'ciao', ...params },
                templateId: templateId
            },
            json: true
        };

        request(options, (error, response, body) => {
            if (error) {
                LOG.error(error);
                LOG.error(response);
            }
            LOG.debug(options.body);
            LOG.debug(body);
        });
    }
}