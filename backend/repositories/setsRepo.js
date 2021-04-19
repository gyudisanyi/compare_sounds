import queryAsync from '../database.js';

export const setsRepo = {
  async newSet(userId) {
    const sql = "INSERT INTO sets (title, description, user_id) VALUES ('New set', 'Add description', ?);";
    return await queryAsync(sql, [userId]);
  },

  async authUser(setId, userId) {
    const sql = 'SELECT * FROM sets WHERE idset=? AND user_id=?';
    return await queryAsync(sql, [setId, userId]);
  },

  async getAllSets() {
    const sql = 'SELECT idset AS id, description, title, img_url, username, published FROM sets JOIN users ON user_id = iduser WHERE deleted IS NULL AND published IS NOT NULL';
    return await queryAsync(sql);
  },
  async getUserSets(id) {
    const sql = 'SELECT idset AS id, description, title, img_url, username, published FROM sets JOIN users ON user_id = iduser WHERE user_id = ? AND deleted IS NULL';
    return await queryAsync(sql, [id]);
  },
  async getSetData(setId) {
    const sql = 'SELECT idset AS id, user_id, username, description, title, img_url, published FROM sets JOIN users ON user_id = iduser WHERE idset = ? AND deleted IS NULL';
    return await queryAsync(sql, [setId]);
  },
  async deleteSet(setId) {
    const sql = 'UPDATE sets SET deleted=NOW() WHERE idset=?';
    return await queryAsync(sql, [setId]);
  },
  async publishSet(setId) {
    const sql = 'UPDATE sets SET published = CASE WHEN published IS NULL THEN NOW() ELSE NULL END WHERE idset=?';
    return await queryAsync(sql, [setId]);
  },

  async setTitle(title, setId) {
    const sql = 'UPDATE sets SET title=? WHERE idset=?';
    return await queryAsync(sql, [title.substring(0,29), setId]);
  },
  async setDescription(description, setId) {
    const sql = 'UPDATE sets SET description=? WHERE idset=? AND user_id=?';
    return await queryAsync(sql, [description.substring(0,29), setId]);
  },
  async addImage(setId, name) {
    const sql = 'UPDATE sets SET img_url=? WHERE idset=?';
    return await queryAsync(sql, [name, setId]);
  }
}