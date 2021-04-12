import { setsRepo } from '../repositories/index.js';
import objectifier from './objectifier.js';

export const setsService = {
  async newSet(userId) {
    let Data = await setsRepo.newSet(userId);
    return Data.insertId;
    },
  async deleteSet(setId) {
      await setsRepo.deleteSet(setId);
      return { message: 'Set logically deleted. Admin can revert.'};
    },
  async getUserSets(userId) {
    return objectifier(await setsRepo.getUserSets(userId));  
  },
  async setData(setId) {
    return await setsRepo.getSetData(setId);
  },
  async setTitle(title, setId, userId) {
    return await setsRepo.setTitle(title, setId, userId);
  },
  async setDescription(description, setId, userId) {
    return await setsRepo.setDescription(description, setId, userId);
  },

}
