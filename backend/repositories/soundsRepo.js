import queryAsync from '../database.js';

export const soundsRepo = {
  async getSounds(setId) {
    const sql = 'SELECT idsound AS id, title, filename, description, img_url, duration FROM sounds WHERE set_id = ? AND deleted IS NULL;'
    return await queryAsync(sql, [setId]);
  },
  async newSound(name, duration, setId, userId) {
    const sql = 'INSERT INTO sounds (title, description, filename, duration, set_id, user_id) VALUES (?, ?, ?, ?, ?, ?);'
    return await queryAsync(sql, [name.substring(0, 49), name.substring(0, 249), name, duration, setId, userId]);
  },
  async changeTitle(soundId, title) {
    const sql = 'UPDATE sounds SET title=? WHERE idsound=?;';
    return await queryAsync(sql, [title.substring(0,49), soundId]);
  },
  async changeDescription(soundId, description) {
    const sql = 'UPDATE sounds SET description=? WHERE idsound=?;';
    return await queryAsync(sql, [description.substring(0,249), soundId]);
  },
  async deleteSound(soundId) {
    const sql = 'UPDATE sounds SET deleted=NOW() WHERE idsound=?';
    return await queryAsync(sql, [soundId]);
  },

  async addImage(trackId, name) {
    const sql = 'UPDATE sounds SET img_url=? WHERE idsound=?';
    return await queryAsync(sql, [name, trackId])
  }

}