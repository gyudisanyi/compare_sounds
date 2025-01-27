import hashPassword from './hashPassword.service.js';
import { usersRepo } from '../repositories/index.js';

export const registrationService = {
  async insertNewUser(username, password) {
    const hashedPassword = hashPassword(password, 10);
    const newUser = await usersRepo.insertNewUser(username, hashedPassword);
    return {
      insertId: newUser.insertId,
      message: 'Welcome! A new set was made for you to complete and share!',
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
    
    if (username.length > 49) {
      throw {
        message: 'Username too long',
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

    if (password.length < 4) {
      throw {
        message: 'Password is too short. Minimum 4 characters.',
        status: 400,
      };
    }

  },

  async validateUser(username, password) {
    await this.validateUsername(username);
    this.validatePassword(password);
  },

};
