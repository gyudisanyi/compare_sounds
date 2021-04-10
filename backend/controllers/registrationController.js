import { registrationService, setsService } from '../services/index.js';

export const registrationController = {
  async post(req, res, next) {
    try {
      const {
        username, password,
      } = req.body;
      await registrationService.validateUser(
        username, password,
      );
      const registration = await registrationService.insertNewUser(
        username, password,
      );
      
      const newSetId = await setsService.newSet(registration.insertId);

      res.status(201).json({ 
        newSetId,
        message: registration.message });
    } catch (error) {
      next(error);
    }
  },
};
