import { loginService } from '../services/index.js';

export const loginController = {
  async post(req, res, next) {
    try {
      const returnData = await loginService.getToken(req.body.username, req.body.password);
      res.status(200).json(returnData);
    } catch (error) {
      next(error);
    }
  },

};