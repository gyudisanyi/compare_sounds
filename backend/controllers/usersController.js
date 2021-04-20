import jwt from 'jsonwebtoken';
import { usersService } from '../services/index.js';

export const usersController =  {

  async getUsers (req, res, next) {
    try {
      const users = await usersService.getUsers();
      res.status(200).json({data: users})
    } catch (error) {
      next(error)
    }
  
  },

  async getUserSets (req, res, next) {
    const username = req.params.username;
    try {
      const userSets = await usersService.getSetsByUsername(username);
      res.status(200).json({data: userSets})
    } catch (error) {
      next(error)
    }
  }
}
