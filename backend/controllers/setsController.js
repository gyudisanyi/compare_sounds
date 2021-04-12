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

      let formObj=JSON.parse(data.fields.form);
      
      const {
        Title,
        Description,
      } = formObj.updateSet;
      
      const {
        updateTitles,
        updateDescriptions,
        todelete
      } = formObj.oldTracks;
      
      const Files = data.files.Files;
      console.log(formObj);
      const ToDelete = Object.keys(todelete).filter(k=>todelete[k]);
      console.log(ToDelete);
      if (Files) await soundsService.uploadFiles(Files, setId);
      if (Title) await setsService.setTitle(Title, setId, userId);
      if (Description) await setsService.setDescription(Description, setId, userId);
      if (Object.keys(formObj.newTracks).length > 0) await soundsService.newSounds(formObj.newTracks, setId, userId);
      if (Object.keys(updateTitles).length>0) await soundsService.changeTitles(updateTitles);
      if (Object.keys(updateDescriptions).length>0) await soundsService.changeDescriptions(updateDescriptions);
      if (ToDelete.length>0) await soundsService.deleteSounds(ToDelete);
      res.status(200).json({hey: "JOE"});
    } catch (error) {
      next(error);
    }
  },

};