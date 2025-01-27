import { registrationService, setsService } from '../services/index.js';

export const registrationController = {
  async post(req, res, next) {
    const blacklist = ['user', 'users', 'set', 'sets', 'undefined', 'home', 'collections']
    try {
      const {
        username, password,
      } = req.body;
      if (blacklist.includes(username.toLowerCase()))
        throw {
          message: 'Forbidden username. Nice try!',
          status: 400,
        };

      await registrationService.validateUser(
        username, password,
      );
      const registration = await registrationService.insertNewUser(
        username, password,
      );
      
      const newSetId = await setsService.newSet(registration.insertId);

      res.status(201).json({ 
        data: newSetId,
        message: registration.message });
    } catch (error) {
      next(error);
    }
  },
};
