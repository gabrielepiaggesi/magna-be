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
const BusinessRepository_1 = require("../../mgn-entity/repository/BusinessRepository");
const Logger_1 = require("../../mgn-framework/services/Logger");
const IndroError_1 = require("../../utils/IndroError");
const Preconditions_1 = require("../../utils/Preconditions");
const UserSocialPost_1 = require("../model/UserSocialPost");
const UserSocialPostRepository_1 = require("../repository/UserSocialPostRepository");
const LOG = new Logger_1.Logger("CompanyService.class");
const db = require("../../connection");
const userSocialPostRepository = new UserSocialPostRepository_1.UserSocialPostRepository();
const businessRepository = new BusinessRepository_1.BusinessRepository();
class UserSocialPostService {
    getBusinessSocialPosts(businessId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const businessSocialPosts = yield userSocialPostRepository.findByBusinessId(businessId, connection);
            yield connection.release();
            return businessSocialPosts;
        });
    }
    getUserSocialPosts(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const userSocialPosts = yield userSocialPostRepository.findByUserId(userId, connection);
            yield connection.release();
            return userSocialPosts;
        });
    }
    getUserSocialPost(userSocialPostId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const userSocialPost = yield userSocialPostRepository.findById(userSocialPostId, connection);
            yield connection.release();
            return userSocialPost;
        });
    }
    approveSocialPost(userSocialPostId, loggedUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const userBusinesses = yield businessRepository.findByUserId(loggedUserId, connection);
            const businessesIds = userBusinesses.map(uB => uB.id);
            yield connection.newTransaction();
            const business = yield this.updateUserSocialPostStatus('APPROVED', userSocialPostId, businessesIds, connection);
            yield connection.commit();
            yield connection.release();
            return business;
        });
    }
    discardSocialPost(userSocialPostId, loggedUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const userBusinesses = yield businessRepository.findByUserId(loggedUserId, connection);
            const businessesIds = userBusinesses.map(uB => uB.id);
            yield connection.newTransaction();
            const business = yield this.updateUserSocialPostStatus('DISCARDED', userSocialPostId, businessesIds, connection);
            yield connection.commit();
            yield connection.release();
            return business;
        });
    }
    sendSocialPost(dto, businessId, loggedUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Preconditions_1.Precondition.checkIfFalse((!dto.url), "Post Url Missing");
            const connection = yield db.connection();
            yield connection.newTransaction();
            const newUser = yield this.createUserSocialPost(dto, businessId, loggedUserId, connection);
            yield connection.commit();
            yield connection.release();
            return newUser;
        });
    }
    deleteUserSocialPost(userSocialPostId, loggedUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            yield connection.newTransaction();
            const business = yield this.removeUserSocialPost(userSocialPostId, loggedUserId, connection);
            yield connection.commit();
            yield connection.release();
            return business;
        });
    }
    createUserSocialPost(socialPostDTO, businessId, loggedUserId, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newSocialPost = new UserSocialPost_1.UserSocialPost();
                newSocialPost.url = socialPostDTO.url;
                newSocialPost.business_id = businessId;
                newSocialPost.user_id = loggedUserId;
                newSocialPost.social = 'instagram';
                newSocialPost.status = 'PENDING';
                newSocialPost.discount_id = 0;
                const coInserted = yield userSocialPostRepository.save(newSocialPost, connection);
                newSocialPost.id = coInserted.insertId;
                LOG.info("NEW SOCIAL POST", newSocialPost.id);
                return newSocialPost;
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Create SOCIAL POST", 500, null, e);
            }
        });
    }
    updateUserSocialPostStatus(status, userSocialPostId, businessesIds, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            const socialPost = yield userSocialPostRepository.findById(userSocialPostId, connection);
            if (!socialPost || !businessesIds.includes(socialPost.business_id))
                return socialPost;
            try {
                socialPost.status = status;
                yield userSocialPostRepository.update(socialPost, connection);
                return socialPost;
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Update SocialPost Status", 500, null, e);
            }
        });
    }
    removeUserSocialPost(userSocialPostId, loggedUserId, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            const socialPost = yield userSocialPostRepository.findById(userSocialPostId, connection);
            if (!socialPost || socialPost.id != loggedUserId)
                return socialPost;
            try {
                yield userSocialPostRepository.delete(socialPost, connection);
                return socialPost;
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Delete SocialPost", 500, null, e);
            }
        });
    }
}
exports.UserSocialPostService = UserSocialPostService;
//# sourceMappingURL=UserSocialPostService.js.map