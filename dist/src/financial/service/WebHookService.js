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
const Logger_1 = require("../../utils/Logger");
const WalletService_1 = require("./WalletService");
const StripeService_1 = require("./StripeService");
const LOG = new Logger_1.Logger("WebHookService.class");
const walletService = new WalletService_1.WalletService();
const stripeService = new StripeService_1.StripeService();
const db = require("../../connection");
class WebHookService {
    updateSubScriptionWH(res, sub) {
        return __awaiter(this, void 0, void 0, function* () {
            LOG.debug("subscription webhook", sub.data.object.id);
            sub = yield stripeService.getStripeSubscription(sub.data.object.id);
            const connection = yield db.connection();
            yield connection.newTransaction();
            try {
                const walletIsUpdated = yield walletService.updateUserWallet(sub, connection);
                yield connection.commit();
                yield connection.release();
                if (sub.status == 'past_due' ||
                    sub.status == 'canceled' ||
                    sub.status == 'unpaid') {
                    // notify user
                }
                return res.status(200).send({ status: "success" });
            }
            catch (e) {
                yield connection.rollback();
                yield connection.release();
                LOG.error("subscription webhook error", e);
                return res.status(500).send({ status: "error" });
            }
        });
    }
}
exports.WebHookService = WebHookService;
//# sourceMappingURL=WebHookService.js.map