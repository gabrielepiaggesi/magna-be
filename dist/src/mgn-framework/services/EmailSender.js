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
    static sendSpecificEmail(emailDto) {
        this.send(emailDto.templateId, emailDto.email, emailDto.params);
    }
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
    static sendSubCanceled(emailDto) {
        this.send(5, emailDto.email);
    }
    static sendRetentionEmail() {
        return __awaiter(this, void 0, void 0, function* () {
            const fromDayAgo = 4;
            const toDayAgo = 3;
            const connection = yield db.connection();
            const users = yield genRepository.findUsersToCall(fromDayAgo, toDayAgo, connection);
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
        var options = {
            'method': 'POST',
            'url': 'https://api.sendinblue.com/v3/smtp/email',
            'headers': {
                'api-key': process.env.SENDINBLUE_API_KEY,
                'accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sender: { email: 'magnaappweb@gmail.com', name: 'MAGNA APP' },
                to: [{ email: email }],
                replyTo: { email: 'magnaappweb@gmail.com' },
                params: Object.assign({ default: 'ciao' }, params),
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
exports.EmailSender = EmailSender;
//# sourceMappingURL=EmailSender.js.map