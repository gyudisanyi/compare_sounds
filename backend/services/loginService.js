import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { usersRepo } from '../repositories/usersRepo.js';
import config from '../config.js';

export const loginService = {

  generateAccessToken({ id, username }) {
    return jwt.sign({ id, username }, config.secret || 'someOtherSecret', { expiresIn: '1800000s' });
  },

  async getToken(username, password) {
    if (!username || !password) {
      throw { message: 'Username and/or password not provided!', status: 400 };
    }

    const user = await usersRepo.getUserByUsername(username);
    if (!user[0]) {
      throw { message: 'No such user!', status: 400 };
    }
    const passwordCheck = await usersRepo.getPassword(username);

    if (!await bcrypt.compare(password, passwordCheck[0].passwordHash)) {
      throw { message: 'Username and password do not match!', status: 400 };
    }

    const token = this.generateAccessToken({
      id: user[0].iduser,
      username,
    });
    const returnData = {
      username,
      token,
    };

    return returnData;
  },

};