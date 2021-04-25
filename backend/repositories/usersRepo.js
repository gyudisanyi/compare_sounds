import queryAsync from '../database.js';

export const usersRepo = {
  async insertNewUser(username, hashedPassword) {
    const sql = 'INSERT INTO users (username, password_hash, user_type) VALUES (?, ?, ?);';
    const newUser = await queryAsync(sql, [username.substring(0,49), hashedPassword, 'user']);
    return newUser;
  },

  async getUsers() {
    const sql = 'SELECT username, COUNT(idset) as published_sets FROM users LEFT JOIN sets ON (iduser = user_id) WHERE published IS NOT NULL AND sets.deleted IS NULL GROUP BY iduser;';
    return await queryAsync(sql);
  },

  async getUserByUsername(username) {
    const sql = 'SELECT iduser AS id, username, user_type, password_hash as passwordHash FROM users WHERE username=?;';
    return await queryAsync(sql, [username]);
  },
  async getUserById(userId) {
    const sql = 'SELECT iduser AS id, username, user_type, password_hash as passwordHash FROM users WHERE iduser=?;';
    return await queryAsync(sql, [userId]);
  },
  async getPassword(username) {
    const sql = 'SELECT password_hash AS passwordHash FROM users WHERE username=?;';
    return await queryAsync(sql, [username]);
  },

  async getAllUsers() {
    const sql = 'SELECT iduser AS id, username, user_type FROM users';
    return await queryAsync(sql, []);
  },
};
