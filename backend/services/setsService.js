import { setsRepo } from '../repositories/index.js';
import objectifier from './objectifier.js';

import fs from 'fs-extra';

export const setsService = {
  async newSet(userId) {
    let Data = await setsRepo.newSet(userId);
    return Data.insertId;
    },
  async deleteSet(setId) {
      await setsRepo.deleteSet(setId);
      return { message: 'Set logically deleted. Admin can revert.'};
    },
  async getAllSets() {
    return objectifier(await setsRepo.getAllSets());  
  },
  async getUserSets(userId) {
    return objectifier(await setsRepo.getUserSets(userId));  
  },
  async setData(setId) {
    const set = await setsRepo.getSetData(setId);
    if (!set[0]) {
      throw { message: 'No such set!', status: 400 };
    }
    return set[0];
  },
  async setTitle(title, setId, userId) {
    return await setsRepo.setTitle(title, setId, userId);
  },
  async setDescription(description, setId, userId) {
    return await setsRepo.setDescription(description, setId, userId);
  },
  async uploadImage(image, setId) {
    const uploadPath = `./public/audio_src/${setId}/img/`;
    
    await fs.ensureFile(uploadPath+image.name);
    await fs.copy(image.path, uploadPath+image.name);
    return await setsRepo.addImage(setId, image.name);
  },

}
