import { soundsService } from '../services/index.js'

export const soundsController = {

  async uploadSounds(req, res, next) {
    try {
      const { Files } = req.files;
      const { setId } = req.params;
      let data = await soundsService.addFiles(Files, setId);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  },
}
