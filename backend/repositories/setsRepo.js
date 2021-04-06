import queryAsync from '../database.js';

export const setsRepo = {
  async newSet(userId) {
    const sql = "INSERT INTO sets (title, description, user_id) VALUES ('Empty set', 'Add description', ?);";
    return await queryAsync(sql, [userId]);
  },
  async getUserSets(userId) {
    const sql = 'SELECT idset AS id, description, title FROM sets WHERE user_id = ? AND deleted IS NULL';
    return await queryAsync(sql, [userId]);
  },
  async getSetData(setId) {
    const sql = 'SELECT idset AS id, description, title FROM sets WHERE idset = ? AND deleted IS NULL';
    return await queryAsync(sql, [setId]);
  },
  async setTitle(title, setId, userId) {
    const sql = 'UPDATE sets SET title=? WHERE idset=? AND user_id=?';
    return await queryAsync(sql, [title, setId, userId]);
  },
  async setDescription(description, setId, userId) {
    const sql = 'UPDATE sets SET description=? WHERE idset=? AND user_id=?';
    return await queryAsync(sql, [description, setId, userId]);
  },
}