import { Logger } from "./Logger";
import { GeneralRepository } from "../repositories/GeneralRepository";
const request = require('request');
const db = require("../../connection");

const LOG = new Logger("EmailSender.class");
const genRepository = new GeneralRepository();

export class EmailSender {

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

    public static async sendRetentionEmail() {
        const fromDayAgo = 4;
        const toDayAgo = 3;

        const today = new Date(Date.now());
        const fromDate = (new Date(today.setDate(today.getDate() - fromDayAgo))).toISOString().substring(0, 19).replace("T", " ");
        const toDate = (new Date(today.setDate(today.getDate() - toDayAgo))).toISOString().substring(0, 19).replace("T", " ");

        const connection = await db.connection();
        const users = await genRepository.findUsersToCall(fromDate, toDate, connection);
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

    private static send(templateId: number, email: string, params: {} = null) {
        const options = {
            method: 'POST',
            url: 'https://api.sendinblue.com/v3/smtp/email',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                'api-key': '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'
            },
            body: {
                sender: { email: 'pridepartyweb@gmail.com', name: 'PrideParty' },
                to: [{ email: email }],
                replyTo: { email: 'pridepartyweb@gmail.com' },
                params: params,
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