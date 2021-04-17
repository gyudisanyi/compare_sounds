import formidable from 'formidable';
import { soundsService, setsService } from '../services/index.js';

export const imagesController = {
  
  async newImage(req, res, next) {
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
  
      const trackId = data.fields.Id;
      const image = data.files.Files;
      if (trackId == 0) {await setsService.uploadImage(image, setId)}
      else {await soundsService.uploadImage(image, setId, trackId)}
      res.status(200).json({yo: "eight"})
      } catch (error) {
        next(error)
    }
  }
}
