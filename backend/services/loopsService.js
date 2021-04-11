import { loopsRepo } from '../repositories/index.js';
import objectifier from './objectifier.js';

export const loopsService = {
  async getLoops(setId, userId) {
    return objectifier(await loopsRepo.getLoops(setId, userId));
  }
}