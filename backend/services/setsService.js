import { setsRepo } from '../repositories/index.js';
import objectifier from './objectifier.js';

import fs from 'fs-extra';

export const setsService = {
  async newSet(userId) {
    let Data = await setsRepo.newSet(userId);
    return Data.insertId;
    },

  async authUser(setId, userId) {
    let set = await setsRepo.authUser(setId, userId);
    if (!set[0]) {
      throw { message: 'Not your set!', status: 400 };
    }
    return;
  },

  
  async publishSet(setId) {
      const publish = await setsRepo.publishSet(setId);
      console.log(publish);
    return publish;
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

  async setTitle(title, setId) {
    if (title.length > 50) {
       throw { message: 'Set title too long!', status: 400}
      }
    return await setsRepo.setTitle(title, setId);
  },

  async setDescription(description, setId) {
    if (description.length > 250) {
      throw { message: 'Set description too long!', status: 400}
     }
    return await setsRepo.setDescription(description, setId);
  },

  async uploadImage(image, setId) {
    const uploadPath = `./public/audio_src/${setId}/img/`;
    
    await fs.ensureFile(uploadPath+image.name);
    await fs.copy(image.path, uploadPath+image.name);
    return await setsRepo.addImage(setId, image.name);
  },

}
