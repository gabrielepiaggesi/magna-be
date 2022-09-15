"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
const __1 = require("../..");
const Logger_1 = require("../../mgn-framework/services/Logger");
const Decorator_1 = require("../../utils/Decorator");
const UserSocialPostService_1 = require("../service/UserSocialPostService");
// services
const userSocialPostService = new UserSocialPostService_1.UserSocialPostService();
const LOG = new Logger_1.Logger("UserSocialPostController.class");
class UserSocialPostController {
    getBusinessSocialPosts(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield userSocialPostService.getBusinessSocialPosts(parseInt(req.params.businessId, 10));
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'UserSocialPost.getBusinessSocialPosts.Error' }));
            }
        });
    }
    approveSocialPost(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loggedUserId = __1.auth.getLoggedUserId(req);
                const response = yield userSocialPostService.approveSocialPost(parseInt(req.params.userSocialPostId, 10), loggedUserId);
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'UserSocialPost.approveSocialPost.Error' }));
            }
        });
    }
    discardSocialPost(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loggedUserId = __1.auth.getLoggedUserId(req);
                const response = yield userSocialPostService.discardSocialPost(parseInt(req.params.userSocialPostId, 10), loggedUserId);
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'UserSocialPost.discardSocialPost.Error' }));
            }
        });
    }
    sendSocialPost(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loggedUserId = __1.auth.getLoggedUserId(req);
                const response = yield userSocialPostService.sendSocialPost(req.body, parseInt(req.params.businessId, 10), loggedUserId);
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'UserSocialPost.sendSocialPost.Error' }));
            }
        });
    }
    getUserSocialPosts(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loggedUserId = __1.auth.getLoggedUserId(req);
                const response = yield userSocialPostService.getUserSocialPosts(loggedUserId);
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'UserSocialPost.getUserSocialPosts.Error' }));
            }
        });
    }
    getUserSocialPost(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield userSocialPostService.getUserSocialPost(parseInt(req.params.userSocialPostId, 10));
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'UserSocialPost.getUserSocialPost.Error' }));
            }
        });
    }
    deleteUserSocialPost(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loggedUserId = __1.auth.getLoggedUserId(req);
                const response = yield userSocialPostService.deleteUserSocialPost(parseInt(req.params.userSocialPostId, 10), loggedUserId);
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'UserSocialPost.deleteUserSocialPost.Error' }));
            }
        });
    }
}
__decorate([
    Decorator_1.Get(),
    Decorator_1.Path("/getBusinessSocialPosts/:businessId")
], UserSocialPostController.prototype, "getBusinessSocialPosts", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/approveSocialPost/:userSocialPostId")
], UserSocialPostController.prototype, "approveSocialPost", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/discardSocialPost/:userSocialPostId")
], UserSocialPostController.prototype, "discardSocialPost", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/sendSocialPost/:businessId")
], UserSocialPostController.prototype, "sendSocialPost", null);
__decorate([
    Decorator_1.Get(),
    Decorator_1.Path("/getUserSocialPosts")
], UserSocialPostController.prototype, "getUserSocialPosts", null);
__decorate([
    Decorator_1.Get(),
    Decorator_1.Path("/getUserSocialPost/:userSocialPostId")
], UserSocialPostController.prototype, "getUserSocialPost", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/deleteUserSocialPost/:userSocialPostId")
], UserSocialPostController.prototype, "deleteUserSocialPost", null);
exports.UserSocialPostController = UserSocialPostController;
//# sourceMappingURL=UserSocialPostController.js.map