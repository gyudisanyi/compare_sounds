import formidable from 'formidable';
import { setsService, soundsService, loopsService } from '../services/index.js';

export const setsController = {

  async newSet(req, res, next) {
    try {
      const userId = req.user.userid;
      const newSetId = await setsService.newSet(userId);
      res.status(201).json({"newSetId":newSetId});
    } catch (error) {
      next(error);
    }
  },

  async publishSet(req, res, next) {
    try {
      const { setId } = req.params;
      const userId = req.user.userid;
      await setsService.authUser(setId, userId);
      const publish = await setsService.publishSet(setId);
      res.status(200).json({message: publish.message});
    } catch (error) {
      next(error);
    }
  },

  async deleteSet(req, res, next) {
    try {
      const { setId } = req.params;
      const userId = req.user.userid;
      await setsService.authUser(setId, userId);
      const deleted = await setsService.deleteSet(setId);
      res.status(200).json({message: deleted.message});
    } catch (error) {
      next(error);
    }
  },

  
  async allSets(req, res, next) {
    try {
      const sets = await setsService.getAllSets();
      res.status(200).json(sets);
    } catch (error) {
      next(error);
    }
  },

  async userSets(req, res, next) {
    try {
      const userId = req.user.userid || req.params.userId;
      const sets = await setsService.getUserSets(userId);
      res.status(200).json(sets);
    } catch (error) {
      next(error);
    }
  },

  async getSetContents(req, res, next) {
    try {
      const { setId } = req.params;
      const set = await setsService.setData(setId);
      const tracks = await soundsService.getSounds(setId);
      let minDuration = 0;
      let shortestTrackId = 0;
      if (Object.values(tracks).length > 0) {
        minDuration = Math.min(...Object.values(tracks).map(t => t.duration));
        shortestTrackId = (Object.values(tracks).filter(t => t.duration == minDuration))[0].id
      }
      set["duration"] = minDuration;
      set["shortest"] = shortestTrackId;
      const loops = await loopsService.getLoops(setId);
      const data = { set, tracks, loops };
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  },

  async editSets(req, res, next) {
    try {
      const form = formidable({multiples: true});
      const { setId } = req.params;
      const userId = req.user.userid;

      await setsService.authUser(setId, userId);

      let data = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields) => {
        if (err) {
          next(err);
          return;
        }
        resolve ({fields})
      })});

      let formObj = JSON.parse(data.fields.form);
      
      const {
        Title,
        Description,
      } = formObj.updateSet;
      
      const {
        updateTitles,
        updateDescriptions,
        todelete
      } = formObj.oldTracks;
      
      const ToDelete = Object.keys(todelete).filter(k=>todelete[k]);
      if (Title) await setsService.setTitle(Title, setId);
      if (Description) await setsService.setDescription(Description, setId);
      if (Object.keys(updateTitles).length>0) await soundsService.changeTitles(updateTitles);
      if (Object.keys(updateDescriptions).length>0) await soundsService.changeDescriptions(updateDescriptions);
      if (ToDelete.length>0) await soundsService.deleteSounds(ToDelete);
      res.status(200).json({message: "Set data updated."});
    } catch (error) {
      next(error);
    }
  },

};