import { registrationService } from '../services/index.js';

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
      res.status(201).json({ message: registration.message });
    } catch (error) {
      next(error);
    }
  },
};
