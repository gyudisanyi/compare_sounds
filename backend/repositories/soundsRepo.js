import queryAsync from '../database.js';

export const soundsRepo = {
  async getSounds(setId, userId) {
    const sql = 'SELECT idsound AS id, title, filename, description, img_url FROM sounds WHERE set_id = ? and user_id = ? AND deleted IS NULL;'
    return await queryAsync(sql, [setId, userId]);
  },
  async addSounds(title, filename, description, setId, userId) {
    const sql = 'INSERT INTO sounds (title, filename, description, set_id, user_id) VALUES (?, ?, ?, ?);'
    return await queryAsync(sql, [title, filename, description, setId, userId]);
  },
  async retitleSounds(title, soundId) {
    const sql = 'UPDATE sounds SET title=? WHERE idsound=?;';
    return await queryAsync(sql, [title, soundId]);
  },
  async redescribeSounds(description, soundId) {
    const sql = 'UPDATE sounds SET description=? WHERE idsound=?;';
    return await queryAsync(sql, [title, soundId]);
  },
  async deleteSounds(soundId) {
    const sql = 'UPDATE sounds SET deleted=NOW() WHERE idsound=?';
    return await queryAsync(sql, [soundId]);
  }
}