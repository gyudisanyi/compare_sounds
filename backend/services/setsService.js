import { setsRepo, usersRepo } from '../repositories/index.js';
import { promises as fsPromises } from 'fs';

export const setsService = {
  async newSet(userId) {
    let Data = await setsRepo.newSet(userId);
    let uploadPath = `./public/audio_src/${Data.insertId}/img`;
    await fsPromises.mkdir(uploadPath, { recursive: true });
    return Data.insertId;
    },
  async getUserSets(userId) {
    return await setsRepo.getUserSets(userId);  
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