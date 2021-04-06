import queryAsync from '../database.js';

export const usersRepo = {
  async insertNewUser(username, hashedPassword) {
    const sql = 'INSERT INTO users (username, password_hash) VALUES (?, ?);';
    return await queryAsync(sql, [username, hashedPassword]);
  },
  async getUserByUsername(username) {
    const sql = 'SELECT iduser, username, password_hash as passwordHash FROM users WHERE username=?;';
    return await queryAsync(sql, [username]);
  },
  async getUserById(userId) {
    const sql = 'SELECT iduser, username, password_hash as passwordHash FROM users WHERE iduser=?;';
    return await queryAsync(sql, [userId]);
  },
  async getPassword(username) {
    const sql = 'SELECT password_hash AS passwordHash FROM users WHERE username=?;';
    return await queryAsync(sql, [username]);
  },

  async getAllUsers() {
    const sql = 'SELECT iduser, username FROM users';
    return await queryAsync(sql, []);
  },
};
