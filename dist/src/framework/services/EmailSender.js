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
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = require("./Logger");
const GeneralRepository_1 = require("../repositories/GeneralRepository");
const request = require('request');
const db = require("../../connection");
const LOG = new Logger_1.Logger("EmailSender.class");
const genRepository = new GeneralRepository_1.GeneralRepository();
class EmailSender {
    static sendWelcomeMessage(emailDto) {
        this.send(1, emailDto.email);
    }
    static sendRetentionMessage(emailDto) {
        this.send(2, emailDto.email);
    }
    static sendNewMemberMessage(emailDto) {
        this.send(3, emailDto.email, emailDto.params);
    }
    static sendNewRenewMessage(emailDto) {
        this.send(4, emailDto.email, emailDto.params);
    }
    static sendRetentionEmail() {
        return __awaiter(this, void 0, void 0, function* () {
            const fromDayAgo = 4;
            const toDayAgo = 3;
            const today = new Date(Date.now());
            const fromDate = (new Date(today.setDate(today.getDate() - fromDayAgo))).toISOString().substring(0, 19).replace("T", " ");
            const toDate = (new Date(today.setDate(today.getDate() - toDayAgo))).toISOString().substring(0, 19).replace("T", " ");
            const connection = yield db.connection();
            const users = yield genRepository.findUsersToCall(fromDate, toDate, connection);
            yield connection.release();
            LOG.debug("retention email users size", users.length);
            for (let i = 0; i < users.length; i++) {
                const us = users[i];
                LOG.debug("sending retention email to", us.email);
                try {
                    this.send(2, us.email);
                    LOG.debug("done");
                }
                catch (e) {
                    LOG.error("sendRetentionEmail", e);
                }
                yield this.sleep(1000);
            }
            return true;
        });
    }
    static sleep(ms) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => setTimeout(resolve, ms));
        });
    }
    static send(templateId, email, params = {}) {
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
                params: Object.assign({ default: 'ciao' }, params),
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
exports.EmailSender = EmailSender;
//# sourceMappingURL=EmailSender.js.map