import { Response } from "express";
import { Database } from "../database";
import { auth } from "../integration/middleware/index";
import { Logger } from "../utils/Logger";
import { Story } from "../models/Story";
import { NewStoryDTO } from "../dtos/NewStoryDTO";
import { StoryRepository } from "../repositories/StoryRepository";
import { FullStory } from "../models/FullStory";
import { FullStoryRepository } from "../repositories/FullStoryRepository";
import { UserRepository } from "../repositories/UserRepository";
import { User } from "../models/User";
import { StoryLike } from "../models/StoryLike";
import { StoryLikeRepository } from "../repositories/StoryLikeRepository";
import { StorySaved } from "../models/StorySaved";
import { StorySaveRepository } from "../repositories/StorySaveRepository";
const LOG = new Logger("StoryService.class");

const storyRepository = new StoryRepository();
const userRepository = new UserRepository();
const storyLikeRepository = new StoryLikeRepository();
const storySaveRepository = new StorySaveRepository();
const fullStoryRepository = new FullStoryRepository();
const db = new Database();

export class StoryService {

    public async createStory(res: Response, newStoryDTO: NewStoryDTO) {
        LOG.debug("createStory", newStoryDTO);
        
        const userLogged = auth.loggedId;
        await db.newTransaction();
        try {
            const user = await userRepository.findById(userLogged);

            const newFullStory = new FullStory();
            newFullStory.title = newStoryDTO.title;
            newFullStory.text = newStoryDTO.text;
            newFullStory.user_id = userLogged;
            newFullStory.lang = newStoryDTO.lang || user.lang;
            const fullStoryInserted = await fullStoryRepository.save(newFullStory);
            LOG.debug("newFullStoryId ", fullStoryInserted.insertId);

            const newStory = new Story();
            newStory.title = newStoryDTO.title;
            newStory.text = newStoryDTO.text.substring(0, 42);
            newStory.user_id = userLogged;
            newStory.lang = newStoryDTO.lang || user.lang;
            newStory.full_story_id = fullStoryInserted.insertId;
            const storyInserted = await storyRepository.save(newStory);
            LOG.debug("newStoryId ", storyInserted.insertId);

            await db.commit();
            return res.status(200).send(storyInserted);
        } catch (e) {
            await db.rollback();
            return res.status(500).send(e);
        }
    }

    public async editStory(res: Response, editStory: NewStoryDTO) {
        LOG.info("editStory");
        const story = await storyRepository.findByFullStoryId(editStory.id);
        const fullStory = await fullStoryRepository.findById(story.full_story_id);

        fullStory.title = editStory.title;
        fullStory.text = editStory.text;
        story.title = editStory.title;
        story.text = editStory.text.substring(0, 42);

        await db.newTransaction();
        try {
            await storyRepository.update(story);
            await fullStoryRepository.update(fullStory);
            await db.commit();
            return res.status(200).send(story);
        } catch (e) {
            await db.rollback();
            return res.status(500).send(e);
        }
    }

    public async deleteStory(res: Response, storyId: number) {
        LOG.info("deleteStory");
        const story = await storyRepository.findByFullStoryId(storyId);
        const fullStory = await fullStoryRepository.findById(story.full_story_id);

        const deletedAt = new Date(Date.now()).toISOString().substring(0, 19).replace("T", " ");;
        story.deleted_at = deletedAt;
        fullStory.deleted_at = deletedAt;

        await db.newTransaction();
        try {
            await storyRepository.update(story);
            await fullStoryRepository.update(fullStory);
            await db.commit();
            return res.status(200).send({status: "deleted"});
        } catch (e) {
            await db.rollback();
            return res.status(500).send(e);
        }
    }

    public async getStory(res: Response, fullStoryId: number) {
        LOG.debug("getStory");
        const story = await fullStoryRepository.findById(fullStoryId);
        return res.status(200).send(story);
    }

    public async getStoriesList(res: Response, lastStoryId: number) {
        LOG.debug("getStoriesList");
        const userLogged = auth.loggedId;
        const stories = await storyRepository.showStories(userLogged, lastStoryId);
        return res.status(200).send(stories);
    }

    public async getMyStories(res: Response, lastStoryId: number) {
        LOG.debug("getMyStories");
        const userLogged = auth.loggedId;
        const stories = await storyRepository.findStoriesByUserId(userLogged, lastStoryId);
        return res.status(200).send(stories);
    }

    public async getStoriesSaved(res: Response, lastStoryId: number) {
        LOG.debug("getStoriesSaved");
        const userLogged = auth.loggedId;
        const stories = await storyRepository.findStoriesSavedByUserId(userLogged, lastStoryId);
        return res.status(200).send(stories);
    }

    public async getStoriesLiked(res: Response, lastStoryId: number) {
        LOG.debug("getStoriesLiked");
        const userLogged = auth.loggedId;
        const stories = await storyRepository.findStoriesLikedByUserId(userLogged, lastStoryId);
        return res.status(200).send(stories);
    }

    public async likeStory(res: Response, fullStoryId: number) {
        LOG.debug("likeStory " + fullStoryId);
        const userLogged = auth.loggedId;

        await db.newTransaction();
        try {
            const newLike = new StoryLike();
            newLike.full_story_id = fullStoryId;
            newLike.user_id = userLogged;
            const likeInserted = await storyLikeRepository.save(newLike);
            return res.status(200).send(likeInserted.id);
        } catch (e) {
            await db.rollback();
            return res.status(500).send(e);
        }
    }

    public async dislikeStory(res: Response, likeId: number) {
        LOG.info("dislikeStory");
        const like = await storyLikeRepository.findById(likeId);

        const deletedAt = new Date(Date.now()).toISOString().substring(0, 19).replace("T", " ");;
        like.deleted_at = deletedAt;

        await db.newTransaction();
        try {
            await storyLikeRepository.update(like);
            await db.commit();
            return res.status(200).send({status: "disliked"});
        } catch (e) {
            await db.rollback();
            return res.status(500).send(e);
        }
    }

    public async saveStory(res: Response, fullStoryId: number) {
        LOG.debug("saveStory " + fullStoryId);
        const userLogged = auth.loggedId;

        await db.newTransaction();
        try {
            const newSave = new StorySaved();
            newSave.full_story_id = fullStoryId;
            newSave.user_id = userLogged;
            const saveInserted = await storySaveRepository.save(newSave);
            return res.status(200).send(saveInserted.id);
        } catch (e) {
            await db.rollback();
            return res.status(500).send(e);
        }
    }

    public async unsaveStory(res: Response, saveId: number) {
        LOG.info("unsaveStory");
        const save = await storySaveRepository.findById(saveId);

        const deletedAt = new Date(Date.now()).toISOString().substring(0, 19).replace("T", " ");;
        save.deleted_at = deletedAt;

        await db.newTransaction();
        try {
            await storySaveRepository.update(save);
            await db.commit();
            return res.status(200).send({status: "unsaved"});
        } catch (e) {
            await db.rollback();
            return res.status(500).send(e);
        }
    }
}
