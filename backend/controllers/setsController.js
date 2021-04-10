import formidable from 'formidable';
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

  async deleteSet(req, res, next) {
    try {
      
      const { setId } = req.params;
      const deleted = await setsService.deleteSet(setId);
      res.status(200).json({message: deleted.message});
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
    try {
      const form = formidable({multiples: true});
      const { setId } = req.params;
      const userId = req.user.id;
      let data = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          next(err);
          return;
        }
        resolve ({fields, files})
      })});

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
       } = JSON.parse(data.fields.form);

      const Files = data.files.Files;
      let dataz = {}
      if (Files) dataz += await soundsService.uploadFiles(Files, setId);
      if (Title) dataz += await setsService.setTitle(Title, setId, userId);
      if (Description) dataz += await setsService.setDescription(Description, setId, userId);
      if (NewFilenames) dataz += await soundsService.newSounds(NewFilenames, TrackTitles, TrackDescriptions, setId, userId);
      if (AlteredTitles) dataz += await soundsService.changeTitles(AlteredTitles, OldTrackTitles);
      if (AlteredDescriptions) dataz += await soundsService.changeDescriptions(AlteredDescriptions, OldTrackDescriptions);
      if (ToDelete) dataz += await soundsService.deleteSounds(ToDelete);
      res.status(200).json(data.fields.form);
    } catch (error) {
      next(error);
    }
  },

};