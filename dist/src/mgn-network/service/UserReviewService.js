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
const Logger_1 = require("../../mgn-framework/services/Logger");
const IndroError_1 = require("../../utils/IndroError");
const Preconditions_1 = require("../../utils/Preconditions");
const UserReview_1 = require("../model/UserReview");
const UserReviewRepository_1 = require("../repository/UserReviewRepository");
const UserDiscountService_1 = require("../../mgn-reward/service/UserDiscountService");
const BusinessRepository_1 = require("../../mgn-entity/repository/BusinessRepository");
const LOG = new Logger_1.Logger("CompanyService.class");
const db = require("../../connection");
const userReviewRepository = new UserReviewRepository_1.UserReviewRepository();
const businessRepository = new BusinessRepository_1.BusinessRepository();
const userDiscountService = new UserDiscountService_1.UserDiscountService();
class UserReviewService {
    getBusinessReviews(businessId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const businessReviews = yield userReviewRepository.findByBusinessId(businessId, connection);
            yield connection.release();
            return businessReviews;
        });
    }
    getUserReviews(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const usersReviews = yield userReviewRepository.findByUserId(userId, connection);
            yield connection.release();
            return usersReviews;
        });
    }
    addBusinessReview(dto, businessId, loggedUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Preconditions_1.Precondition.checkIfFalse((!dto.text), "Text Missing");
            const connection = yield db.connection();
            const userReviewsHere = yield userReviewRepository.findByUserIdAndBusinessId(businessId, loggedUserId, connection);
            const business = yield businessRepository.findById(businessId, connection);
            yield connection.newTransaction();
            const newUser = yield this.createUserReview(dto, businessId, loggedUserId, connection);
            if (business.discount_on_first_review && userReviewsHere && !userReviewsHere.length) {
                yield userDiscountService.addUserOriginDiscount(businessId, loggedUserId, 'FIRST_ACTION', connection);
            }
            yield connection.commit();
            yield connection.release();
            return newUser;
        });
    }
    deleteUserReview(userReviewId, loggedUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            yield connection.newTransaction();
            const business = yield this.removeUserReview(userReviewId, loggedUserId, connection);
            yield connection.commit();
            yield connection.release();
            return business;
        });
    }
    createUserReview(reviewDTO, businessId, loggedUserId, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newReview = new UserReview_1.UserReview();
                newReview.text = reviewDTO.text;
                if (reviewDTO.rating)
                    newReview.rating = +reviewDTO.rating;
                newReview.business_id = businessId;
                newReview.user_id = loggedUserId;
                const coInserted = yield userReviewRepository.save(newReview, connection);
                newReview.id = coInserted.insertId;
                LOG.info("NEW BUSINESS", newReview.id);
                return newReview;
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Create BUSINESS", 500, null, e);
            }
        });
    }
    removeUserReview(userReviewId, loggedUserId, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            const review = yield userReviewRepository.findById(userReviewId, connection);
            if (!review || review.id != loggedUserId)
                return review;
            try {
                yield userReviewRepository.delete(review, connection);
                return review;
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Delete Review", 500, null, e);
            }
        });
    }
}
exports.UserReviewService = UserReviewService;
//# sourceMappingURL=UserReviewService.js.map