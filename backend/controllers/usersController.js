import jwt from 'jsonwebtoken';
import { usersService } from '../services/index.js';

export const usersController =  {

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
