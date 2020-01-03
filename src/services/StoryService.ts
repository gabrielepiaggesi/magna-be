import { Response } from "express";
import { Database } from "../database";
import { auth } from "../integration/middleware/index";
import { Logger } from "../utils/Logger";
import { Story } from "../models/Story";
import { NewStoryDTO } from "../dtos/NewStoryDTO";
import { StoryRepository } from "../repositories/StoryRepository";
const LOG = new Logger("StoryService.class");

const storyRepository = new StoryRepository();
const db = new Database();

export class StoryService {

    public async createStory(res: Response, newStoryDTO: NewStoryDTO) {
        LOG.debug("createStory", newStoryDTO);
        
        const userLogged = auth.loggedId;
        await db.newTransaction();
        try {
            const newStory = new Story();
            newStory.title = newStoryDTO.title;
            newStory.text = newStoryDTO.text;
            newStory.user_id = userLogged;
            const storyInserted = await storyRepository.save(newStory);
            LOG.debug("newStoryId ", storyInserted.insertId);
            
            await db.commit();
            return res.status(200).send(storyInserted);
        } catch (e) {
            await db.rollback();
            return res.status(500).send(e);
        }
    }

    public async editStory(res: Response, obj) {
        LOG.info("editStory");
    }

    public async deleteStory(res: Response, storyId: number) {
        LOG.info("deleteStory");
    }

    public async getStory(res: Response, storyId: number) {
        LOG.debug("getStory");
        const story = await storyRepository.findById(storyId);
        return res.status(200).send(story);
    }

    public async getStoriesList(res: Response, storiesId: number[]) {
        LOG.debug("getStoriesList");
        const story = await storyRepository.findStoriesToShow(storiesId);
        return res.status(200).send(story);
    }
}
