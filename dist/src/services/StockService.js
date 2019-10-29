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
const PaymentIntentStatus_1 = require("../enums/PaymentIntentStatus");
const StockStatus_1 = require("../enums/StockStatus");
const index_1 = require("../integration/middleware/index");
const PaymentIntent_1 = require("../models/PaymentIntent");
const Stock_1 = require("../models/Stock");
const CreatorRepository_1 = require("../repositories/CreatorRepository");
const PaymentIntentRepository_1 = require("../repositories/PaymentIntentRepository");
const StockRepository_1 = require("../repositories/StockRepository");
const Logger_1 = require("../utils/Logger");
const LOG = new Logger_1.Logger("StockService.class");
const stockRepository = new StockRepository_1.StockRepository();
const creatorRepository = new CreatorRepository_1.CreatorRepository();
const paymentsIntentsRepository = new PaymentIntentRepository_1.PaymentIntentRepository();
class StockService {
    preorderStocks(res, preorder) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const creator = yield creatorRepository.findById(preorder.creator_id);
                LOG.debug("creator: ", creator.id);
                if (creator.available_stocks > 0) {
                    // create payment intent
                    const piId = yield this.createPaymentIntent(preorder);
                    yield this.findOrCreateStocksToPreorder(creator.id, preorder.qt, piId, creator.stock_price);
                    return res.status(200).send({ payment_id: piId });
                }
                else {
                    return res.status(200).send("No stocks available");
                }
            }
            catch (e) {
                return res.status(500).send(e);
            }
        });
    }
    confirmStocks(res, confirm) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // retrieve payment intent
                // set status success to pi
                // change stock status to confirmed
                // tslint:disable-next-line:max-line-length
                yield paymentsIntentsRepository.updateByIdWithStatusWithDeletedAt(confirm.payment_id, PaymentIntentStatus_1.PaymentIntentStatus.SUCCESS, null);
                // tslint:disable-next-line:max-line-length
                yield stockRepository.updateByPaymentIdWithStatusWithDeletedAt(confirm.payment_id, StockStatus_1.StockStatus.CONFIRMED, null);
                // tslint:disable-next-line:max-line-length
                const confirmed = yield stockRepository.updateByParentPaymentIdWithStatusWithParentPaymentId(confirm.payment_id, StockStatus_1.StockStatus.SOLD, confirm.payment_id);
                return res.status(200).send(confirmed);
            }
            catch (e) {
                return res.status(500).send(e);
            }
        });
    }
    sellStocks(res, sell) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // change stock status to selling
                const logged = index_1.auth.loggedId;
                // tslint:disable-next-line:max-line-length
                const selling = yield stockRepository.updateByCreatorIdAndByUserIdWithStatusWithLimit(sell.creator_id, logged, StockStatus_1.StockStatus.SELLING, sell.qt);
                return res.status(200).send(selling);
            }
            catch (e) {
                return res.status(500).send(e);
            }
        });
    }
    resetStocks(res, reset) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // find stock to reset in selling by buyer_id or newones to delete
                // set status success to pi
                // change stock status to confirmed
                const deletedAt = new Date(Date.now()).toISOString().substring(0, 19).replace("T", " ");
                // tslint:disable-next-line:max-line-length
                yield paymentsIntentsRepository.updateByIdWithStatusWithDeletedAt(reset.payment_id, PaymentIntentStatus_1.PaymentIntentStatus.FAILED, deletedAt);
                // tslint:disable-next-line:max-line-length
                yield stockRepository.updateByPaymentIdWithStatusWithDeletedAt(reset.payment_id, StockStatus_1.StockStatus.FAILED, deletedAt);
                // tslint:disable-next-line:max-line-length
                const resetted = yield stockRepository.updateByParentPaymentIdWithStatusWithParentPaymentId(reset.payment_id, StockStatus_1.StockStatus.SELLING, null);
                return res.status(200).send(resetted);
            }
            catch (e) {
                return res.sendStatus(500).send(e);
            }
        });
    }
    createPaymentIntent(preorder) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const logged = index_1.auth.loggedId;
                const payment = new PaymentIntent_1.PaymentIntent();
                payment.user_id = logged;
                payment.stock_price = preorder.stock_price;
                payment.creator_id = preorder.creator_id;
                payment.quantity = preorder.qt,
                    payment.status = PaymentIntentStatus_1.PaymentIntentStatus.PENDING;
                const newPayment = yield paymentsIntentsRepository.save(payment);
                return newPayment.insertId;
            }
            catch (e) {
                throw e;
            }
        });
    }
    findOrCreateStocksToPreorder(creatorId, qt, piId, price) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const logged = index_1.auth.loggedId;
                // tslint:disable-next-line:max-line-length
                const availableStocks = yield stockRepository.findByCreatorIdAndStatus(creatorId, [StockStatus_1.StockStatus.SELLING], qt);
                const totalAvailable = availableStocks.reduce((a, b) => a + (b.quantity || 0), 0);
                LOG.debug("findOrCreateStocks availableStocks: ", totalAvailable);
                const stockPrice = price;
                if (totalAvailable > 0) {
                    const stocksIds = yield availableStocks.map((stockFound) => stockFound.id);
                    LOG.debug("stockIds: ", stocksIds);
                    // tslint:disable-next-line:max-line-length
                    yield stockRepository.updateByIdsWithStatusAndWithBuyerIdWithParentPaymentId(stocksIds, StockStatus_1.StockStatus.PENDING, logged, piId);
                }
                const stock = new Stock_1.Stock();
                stock.operation = +qt;
                stock.creator_id = creatorId;
                stock.quantity = qt;
                stock.status = StockStatus_1.StockStatus.PENDING;
                stock.payment_id = piId;
                stock.stock_price = stockPrice;
                stock.user_id = logged;
                const userInserted = yield stockRepository.save(stock);
                LOG.debug("newUserId ", userInserted.insertId);
                return userInserted;
            }
            catch (e) {
                LOG.debug("error ", e);
                return e;
            }
        });
    }
}
exports.StockService = StockService;
//# sourceMappingURL=StockService.js.map