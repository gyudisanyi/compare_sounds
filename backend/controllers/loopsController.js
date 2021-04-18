import { loopsService } from "../services/index.js";

export const loopsController = {
  async newLoop(req, res, next) {
    const setId = req.params.setId;
    const userId = req.user.userid;
    const loop = req.body;
    try {
      const returnData = await loopsService.newLoop(setId, userId, loop);
      res.status(201).json(returnData);
    } catch (error) {
      next(error)
    }
  },
  async editLoops(req, res, next) {
    const loops = req.body;
    const loopsArray=Object.values(loops.loops)
    try {
      const data = await loopsService.updateLoops(loopsArray);
      const del = await loopsService.deleteLoops(loops.deleted);
      res.status(200).json(data);
    } catch(error) {
      next(error)
    }
  }
}
