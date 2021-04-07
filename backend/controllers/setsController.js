import { setsService, soundsService, loopsService } from '../services/index.js';

export const setsController = {

  async newSet(req, res, next) {
    try {
      const userId = req.user.id;
      const newSetId = await setsService.newSet(userId);
      res.status(201).json({"newSetId":newSetId});
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

  async getSetContents(req, res, next) {
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
    let data;
    try {
      const { setId } = req.params;
      const userId = req.user.id;
      const { body } = req;
      const {
        Title,
        Description,
        NewFilenames,
        TrackTitles,
        TrackDescriptions,
        AlteredTitles,
        OldTrackTitles,
        AlteredDescriptions,
        OldTrackDescriptions,
        ToDelete,
       } = body;
      
      if (Title) await setsService.setTitle(Title, setId, userId);
      if (Description) await setsService.setDescription(Description, setId, userId);
      if (NewFilenames) data = await soundsService.newSounds(NewFilenames, TrackTitles, TrackDescriptions, setId, userId);
      if (AlteredTitles) await soundsService.changeTitles(AlteredTitles, OldTrackTitles);
      if (AlteredDescriptions) await soundsService.changeDescriptions(AlteredDescriptions, OldTrackDescriptions);
      if (ToDelete) await soundsService.deleteSounds(ToDelete);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  },

};