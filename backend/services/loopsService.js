import { loopsRepo } from '../repositories/index.js';

export const loopsService = {
  async getLoops(setId, userId) {
    return await loopsRepo.getLoops(setId, userId);
  }
}