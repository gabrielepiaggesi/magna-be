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
const database_1 = require("../database");
const index_1 = require("../integration/middleware/index");
const Logger_1 = require("../utils/Logger");
const Story_1 = require("../models/Story");
const StoryRepository_1 = require("../repositories/StoryRepository");
const FullStory_1 = require("../models/FullStory");
const FullStoryRepository_1 = require("../repositories/FullStoryRepository");
const UserRepository_1 = require("../repositories/UserRepository");
const StoryLike_1 = require("../models/StoryLike");
const StoryLikeRepository_1 = require("../repositories/StoryLikeRepository");
const StorySaved_1 = require("../models/StorySaved");
const StorySaveRepository_1 = require("../repositories/StorySaveRepository");
const LOG = new Logger_1.Logger("StoryService.class");
const storyRepository = new StoryRepository_1.StoryRepository();
const userRepository = new UserRepository_1.UserRepository();
const storyLikeRepository = new StoryLikeRepository_1.StoryLikeRepository();
const storySaveRepository = new StorySaveRepository_1.StorySaveRepository();
const fullStoryRepository = new FullStoryRepository_1.FullStoryRepository();
const db = new database_1.Database();
class StoryService {
    createStory(res, newStoryDTO) {
        return __awaiter(this, void 0, void 0, function* () {
            LOG.debug("createStory", newStoryDTO);
            const userLogged = index_1.auth.loggedId;
            yield db.newTransaction();
            try {
                const user = yield userRepository.findById(userLogged);
                const newFullStory = new FullStory_1.FullStory();
                newFullStory.title = newStoryDTO.title;
                newFullStory.text = newStoryDTO.text;
                newFullStory.user_id = userLogged;
                newFullStory.lang = newStoryDTO.lang || user.lang;
                const fullStoryInserted = yield fullStoryRepository.save(newFullStory);
                LOG.debug("newFullStoryId ", fullStoryInserted.insertId);
                const newStory = new Story_1.Story();
                newStory.title = newStoryDTO.title;
                newStory.text = newStoryDTO.text.substring(0, 126);
                newStory.user_id = userLogged;
                newStory.lang = newStoryDTO.lang || user.lang;
                newStory.full_story_id = fullStoryInserted.insertId;
                const storyInserted = yield storyRepository.save(newStory);
                LOG.debug("newStoryId ", storyInserted.insertId);
                yield db.commit();
                return res.status(200).send(storyInserted);
            }
            catch (e) {
                yield db.rollback();
                return res.status(500).send(e);
            }
        });
    }
    editStory(res, editStory) {
        return __awaiter(this, void 0, void 0, function* () {
            LOG.info("editStory");
            const story = yield storyRepository.findByFullStoryId(editStory.id);
            const fullStory = yield fullStoryRepository.findById(story.full_story_id);
            fullStory.title = editStory.title;
            fullStory.text = editStory.text;
            story.title = editStory.title;
            story.text = editStory.text.substring(0, 126);
            yield db.newTransaction();
            try {
                yield storyRepository.update(story);
                yield fullStoryRepository.update(fullStory);
                yield db.commit();
                return res.status(200).send(story);
            }
            catch (e) {
                yield db.rollback();
                return res.status(500).send(e);
            }
        });
    }
    deleteStory(res, storyId) {
        return __awaiter(this, void 0, void 0, function* () {
            LOG.info("deleteStory");
            const story = yield storyRepository.findByFullStoryId(storyId);
            const fullStory = yield fullStoryRepository.findById(story.full_story_id);
            const deletedAt = new Date(Date.now()).toISOString().substring(0, 19).replace("T", " ");
            story.deleted_at = deletedAt;
            fullStory.deleted_at = deletedAt;
            yield db.newTransaction();
            try {
                yield storyRepository.update(story);
                yield fullStoryRepository.update(fullStory);
                yield db.commit();
                return res.status(200).send({ status: "deleted" });
            }
            catch (e) {
                yield db.rollback();
                return res.status(500).send(e);
            }
        });
    }
    getStory(res, fullStoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            LOG.debug("getStory");
            const story = yield fullStoryRepository.findById(fullStoryId);
            return res.status(200).send(story);
        });
    }
    getStoriesList(res, lastStoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            LOG.debug("getStoriesList");
            const userLogged = index_1.auth.loggedId;
            const stories = yield storyRepository.showStories(userLogged, lastStoryId);
            return res.status(200).send(stories);
        });
    }
    getMyStories(res, lastStoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            LOG.debug("getMyStories");
            const userLogged = index_1.auth.loggedId;
            const stories = yield storyRepository.findStoriesByUserId(userLogged, lastStoryId);
            return res.status(200).send(stories);
        });
    }
    getStoriesSaved(res, lastStoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            LOG.debug("getStoriesSaved");
            const userLogged = index_1.auth.loggedId;
            const stories = yield storyRepository.findStoriesSavedByUserId(userLogged, lastStoryId);
            return res.status(200).send(stories);
        });
    }
    getStoriesLiked(res, lastStoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            LOG.debug("getStoriesLiked");
            const userLogged = index_1.auth.loggedId;
            const stories = yield storyRepository.findStoriesLikedByUserId(userLogged, lastStoryId);
            return res.status(200).send(stories);
        });
    }
    likeStory(res, fullStoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            LOG.debug("likeStory " + fullStoryId);
            const userLogged = index_1.auth.loggedId;
            yield db.newTransaction();
            try {
                let newLike = yield storyLikeRepository.findByUserIdAndFullStoryId(userLogged, fullStoryId);
                if (newLike)
                    return res.status(200).send({ id: newLike.id });
                newLike = new StoryLike_1.StoryLike();
                newLike.full_story_id = fullStoryId;
                newLike.user_id = userLogged;
                const likeInserted = yield storyLikeRepository.save(newLike);
                return res.status(200).send({ id: likeInserted.insertId });
            }
            catch (e) {
                yield db.rollback();
                return res.status(500).send(e);
            }
        });
    }
    dislikeStory(res, likeId) {
        return __awaiter(this, void 0, void 0, function* () {
            LOG.info("dislikeStory");
            const like = yield storyLikeRepository.findById(likeId);
            const deletedAt = new Date(Date.now()).toISOString().substring(0, 19).replace("T", " ");
            ;
            like.deleted_at = deletedAt;
            yield db.newTransaction();
            try {
                yield storyLikeRepository.update(like);
                yield db.commit();
                return res.status(200).send({ status: "disliked" });
            }
            catch (e) {
                yield db.rollback();
                return res.status(500).send(e);
            }
        });
    }
    saveStory(res, fullStoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            LOG.debug("saveStory " + fullStoryId);
            const userLogged = index_1.auth.loggedId;
            yield db.newTransaction();
            try {
                let newSave = yield storySaveRepository.findByUserIdAndFullStoryId(userLogged, fullStoryId);
                if (newSave)
                    return res.status(200).send({ id: newSave.id });
                newSave = new StorySaved_1.StorySaved();
                newSave.full_story_id = fullStoryId;
                newSave.user_id = userLogged;
                const saveInserted = yield storySaveRepository.save(newSave);
                return res.status(200).send({ id: saveInserted.insertId });
            }
            catch (e) {
                yield db.rollback();
                return res.status(500).send(e);
            }
        });
    }
    unsaveStory(res, saveId) {
        return __awaiter(this, void 0, void 0, function* () {
            LOG.info("unsaveStory");
            const save = yield storySaveRepository.findById(saveId);
            const deletedAt = new Date(Date.now()).toISOString().substring(0, 19).replace("T", " ");
            ;
            save.deleted_at = deletedAt;
            yield db.newTransaction();
            try {
                yield storySaveRepository.update(save);
                yield db.commit();
                return res.status(200).send({ status: "unsaved" });
            }
            catch (e) {
                yield db.rollback();
                return res.status(500).send(e);
            }
        });
    }
}
exports.StoryService = StoryService;
//# sourceMappingURL=StoryService.js.map