import { setsService, soundsService, loopsService } from '../services/index.js';

export const setsController = {

  async newSet(req, res, next) {
    try {
      const userId = req.user.id;
      const newSetId = await setsService.newSet(userId);
      res.status(201).json(newSetId.insertId);
    } catch (error) {
      next(error);
    }
  },

  async userSets(req, res, next) {
    try {
      const userId = req.user.id;
      const sets = await setsService.getUserSets(userId);
      res.status(200).json(sets);
    } catch (error) {
      next(error);
    }
  },

  async setContents(req, res, next) {
    try {
      const { setId } = req.params;
      const userId = req.user.id;
      const setData = await setsService.setData(setId);
      const sounds = await soundsService.getSounds(setId, userId);
      const loops = await loopsService.getLoops(setId, userId);
      const data = { set: setData[0], tracks: sounds, loops };
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  },

  async editSets(req, res, next) {
    try {
      const { setId } = req.params;
      const userId = req.user.id;
      const { files, body } = req;

      if(req.body.title) await setsService.setTitle(body.title, setId, userId);
      if(req.body.description) await setsService.setDescription(body.description, setId, userId);

      if (files) {await soundsService.addFiles(files, body, setId, userId)}

      const setData = await setsService.setData(setId);
      const sounds = await soundsService.getSounds(setId, userId);
      const loops = await loopsService.getLoops(setId, userId);
      const data = { set: setData[0], tracks: sounds, loops };
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  },

};