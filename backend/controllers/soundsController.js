import formidable from 'formidable';
import { soundsService, setsService } from '../services/index.js';

export const soundsController = {

  async newSounds(req, res, next) {
    try {
      const form = formidable();
      const userId = req.user.userid;
      const setId = req.params.setId;
      let data = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) {
            next(err);
            return;
          }
          resolve ({fields, files})
        })});
      const sound = data.files.Files;
      const duration = data.fields.durations;
      await soundsService.uploadSound(sound, duration, setId, userId);
      res.status(200).json({message: "Tracks added"})
    } catch (error) {
      next(error)
    }
  },

}
