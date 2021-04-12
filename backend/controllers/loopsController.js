import { loopsService } from "../services/index.js";

export const loopsController = {
  async newLoop(req, res, next) {
    const userId = req.user.id;
    const setId = req.params.setId;
    const loop = req.body;
    try {
      const returnData = await loopsService.newLoop(userId, setId, loop);
      res.status(201).json(returnData);
    } catch (error) {
      next(error)
    }
  },
  async editLoops(req, res, next) {
    const loops = req.body;
    Object.keys(loops.loops).forEach((key) => loops.loops[key].id = key);
    const loopsArray=Object.values(loops.loops)
    try {
      const data = await loopsService.updateLoops(loopsArray);
      res.status(200).json(data);
    } catch(error) {
      next(error)
    }
  }
}
