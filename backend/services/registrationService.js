import jwt from 'jsonwebtoken';
import hashPassword from './hashPassword.service.js';
import { usersRepo } from '../repositories/index.js';

export const registrationService = {
  async insertNewUser(username, password) {
    const hashedPassword = hashPassword(password, 10);
    await usersRepo.insertNewUser(username, hashedPassword);
    return {
      message: 'Successful registration. User was added to database.',
    };
  },
  
  async validateUsername(username) {
    const usernameFormat = /^[a-z0-9_-]{3,16}$/ig;
    if (!username) {
      throw {
        message: 'Username field is missing.',
        status: 400,
      };
    }

    if (!usernameFormat.test(String(username))) {
      throw {
        message:
          'Username is invalid. Try something else.',
        status: 400,
      };
    }

    const selectedUsername = await usersRepo.getUserByUsername(username);
    console.log({selectedUsername});
    if (selectedUsername.length !== 0) {
      throw {
        message: 'Username is already in use.',
        status: 400,
      };
    }
  },
  
  validatePassword(password) {
    if (!password) {
      throw {
        message: 'Password field is missing.',
        status: 400,
      };
    }

    if (password.length < 6) {
      throw {
        message: 'Password is too short. Minimum 6 characters.',
        status: 400,
      };
    }

  },

  async validateUser(username, password) {
    await this.validateUsername(username);
    this.validatePassword(password);
  },

};