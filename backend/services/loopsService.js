import { loopsRepo } from '../repositories/index.js';
import objectifier from './objectifier.js';

export const loopsService = {
  async getLoops(setId, userId) {
    return objectifier(await loopsRepo.getLoops(setId, userId));
  },

  async newLoop(setId, userId, loop) {
    return await loopsRepo.newLoop(setId, userId, loop)
  },

  async updateLoops(loops) {
    return Promise.all(loops.map((loop) =>
      loopsRepo.updateLoop(loop)));
  },

  async deleteLoops(loopIDs) {
    return Promise.all(loopIDs.map((id) =>
      loopsRepo.deleteLoop(id)));
  },
}
