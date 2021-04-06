import { setUncaughtExceptionCaptureCallback } from 'node:process';
import { setsRepo, usersRepo } from '../repositories/index.js';

export const setsService = {
  async newSet(userId) {
    return await setsRepo.newSet(userId);
    },
  async getUserSets(userId) {
    return await setsRepo.getUserSets(userId);  
  },
  async setData(setId) {
    return await setsRepo.getSetData(setId);  
  },
  async setTitle(title, setId, userId) {
    let r = await setsRepo.setTitle(title, setId, userId);
    console.log(r)
    return r
  },
  async setDescription(description, setId, userId) {
    return await setsRepo.setDescription(description, setId);
  },

}