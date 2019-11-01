import { Response } from "express";
import { Database } from "../database";
import { ConfirmDTO } from "../dtos/ConfirmDTO";
import { PreorderDTO } from "../dtos/PreorderDTO";
import { ResetDTO } from "../dtos/ResetDTO";
import { SellDTO } from "../dtos/SellDTO";
import { PaymentIntentStatus } from "../enums/PaymentIntentStatus";
import { StockStatus } from "../enums/StockStatus";
import { auth } from "../integration/middleware/index";
import { Creator } from "../models/Creator";
import { PaymentIntent } from "../models/PaymentIntent";
import { Stock } from "../models/Stock";
import { CreatorRepository } from "../repositories/CreatorRepository";
import { PaymentIntentRepository } from "../repositories/PaymentIntentRepository";
import { StockRepository } from "../repositories/StockRepository";
import { Logger } from "../utils/Logger";
const LOG = new Logger("StockService.class");

const stockRepository = new StockRepository();
const creatorRepository = new CreatorRepository();
const paymentsIntentsRepository = new PaymentIntentRepository();
const db = new Database();

export class StockService {

    public async preorderStocks(res: Response, preorder: PreorderDTO) {
        await db.newTransaction();
        try {
            const creator = await creatorRepository.findById(preorder.creator_id);
            if (creator.available_stocks <= 0) { return res.status(500).send("No more stocks available!"); }
            LOG.debug("creator: ", creator.id);
            // create payment intent
            const piId = await this.createPaymentIntent(preorder);
            await this.findOrCreateStocksToPreorder(creator.id, preorder.qt, piId, creator.stock_price);
            await creatorRepository.takeAvailableStocks(creator.id, preorder.qt);

            await db.commit();
            return res.status(200).send({ payment_id: piId});
        } catch (e) {
            await db.rollback();
            return res.status(500).send(e);
        }
    }

    public async confirmStocks(res: Response, confirm: ConfirmDTO) {
        await db.newTransaction();
        try {
            // tslint:disable-next-line:max-line-length
            await paymentsIntentsRepository.updateByIdWithStatusWithDeletedAt(confirm.payment_id, PaymentIntentStatus.SUCCESS, null);
            // tslint:disable-next-line:max-line-length
            await stockRepository.updateByPaymentIdWithStatusWithDeletedAt(confirm.payment_id, StockStatus.CONFIRMED, null);
            // tslint:disable-next-line:max-line-length
            const confirmed = await stockRepository.updateByParentPaymentIdWithStatusWithParentPaymentId(confirm.payment_id, StockStatus.SOLD, confirm.payment_id);

            await db.commit();
            return res.status(200).send(confirmed);
        } catch (e) {
            await db.rollback();
            return res.status(500).send(e);
        }
    }

    public async sellStocks(res: Response, sell: SellDTO) {
        await db.newTransaction();
        try {
            // change stock status to selling
            const logged = auth.loggedId;
            await creatorRepository.addAvailableStocks(sell.creator_id, sell.qt);
            // tslint:disable-next-line:max-line-length
            const selling = await stockRepository.updateByCreatorIdAndByUserIdWithStatusWithLimit(sell.creator_id, logged, StockStatus.SELLING, sell.qt);

            await db.commit();
            return res.status(200).send(selling);
        } catch (e) {
            await db.rollback();
            return res.status(500).send(e);
        }
    }

    public async resetStocks(res: Response, reset: ResetDTO) {
        await db.newTransaction();
        try {
            // find stock to reset in selling by buyer_id or newones to delete
            // set status success to pi
            // change stock status to confirmed
            const paymentIntent = await paymentsIntentsRepository.findById(reset.payment_id);
            await creatorRepository.addAvailableStocks(paymentIntent.creator_id, paymentIntent.quantity);
            const deletedAt = new Date(Date.now()).toISOString().substring(0, 19).replace("T", " ");
            // tslint:disable-next-line:max-line-length
            await paymentsIntentsRepository.updateByIdWithStatusWithDeletedAt(reset.payment_id, PaymentIntentStatus.FAILED, deletedAt);
            // tslint:disable-next-line:max-line-length
            await stockRepository.updateByPaymentIdWithStatusWithDeletedAt(reset.payment_id, StockStatus.FAILED, deletedAt);
            // tslint:disable-next-line:max-line-length
            const resetted = await stockRepository.updateByParentPaymentIdWithStatusWithParentPaymentId(reset.payment_id, StockStatus.SELLING, null);

            await db.commit();
            return res.status(200).send(resetted);
        } catch (e) {
            await db.rollback();
            return res.sendStatus(500).send(e);
        }
    }

    private async createPaymentIntent(preorder: PreorderDTO) {
        await db.newTransaction();
        try {
            const logged = auth.loggedId;

            const payment = new PaymentIntent();
            payment.user_id = logged;
            payment.stock_price = preorder.stock_price;
            payment.creator_id = preorder.creator_id;
            payment.quantity = preorder.qt,
            payment.status = PaymentIntentStatus.PENDING;

            const newPayment = await paymentsIntentsRepository.save(payment);

            await db.commit();
            return newPayment.insertId;
        } catch (e) {
            await db.rollback();
            throw e;
        }
    }

    private async findOrCreateStocksToPreorder(creatorId, qt, piId, price) {
        await db.newTransaction();
        try {
            const logged = auth.loggedId;
            // tslint:disable-next-line:max-line-length
            const availableStocks = await stockRepository.findByCreatorIdAndStatus(creatorId, [StockStatus.SELLING], qt);
            const totalAvailable = availableStocks.reduce((a, b) => a + (b.quantity || 0), 0);
            LOG.debug("findOrCreateStocks availableStocks: ", totalAvailable);
            const stockPrice = price;

            if (totalAvailable > 0) {
                const stocksIds = await availableStocks.map((stockFound) => stockFound.id);
                LOG.debug("stockIds: ", stocksIds);
                // tslint:disable-next-line:max-line-length
                await stockRepository.updateByIdsWithStatusAndWithBuyerIdWithParentPaymentId(stocksIds, StockStatus.PENDING, logged, piId);
            }

            const stock = new Stock();
            stock.operation = +qt;
            stock.creator_id = creatorId;
            stock.quantity = qt;
            stock.status = StockStatus.PENDING;
            stock.payment_id = piId;
            stock.stock_price = stockPrice;
            stock.user_id = logged;

            const userInserted = await stockRepository.save(stock);
            LOG.debug("newUserId ", userInserted.insertId);
            await db.commit();
            return userInserted;
        } catch (e) {
            await db.rollback();
            LOG.debug("error ", e);
            return e;
        }
    }
}
