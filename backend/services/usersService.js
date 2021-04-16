import { usersRepo } from '../repositories/usersRepo.js';
import { setsRepo } from '../repositories/setsRepo.js';
import objectifier from './objectifier.js';

export const usersService = {

  async getSetsByUsername(username) {
    const user = await usersRepo.getUserByUsername(username);
    if (!user[0]) {
      throw { message: 'No such user!', status: 400 };
    }
    const { id } = user[0];
    return await setsRepo.getUserSets(id)
  },

};
