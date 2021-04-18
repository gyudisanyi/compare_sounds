import queryAsync from '../database.js';

export const loopsRepo = {
  async getLoops(setId) {
    const sql = 'SELECT idloop AS id, start, end, description FROM loops WHERE set_id = ? AND deleted IS NULL ORDER BY start ASC;'
    return await queryAsync(sql, [setId]);
  },

  async newLoop(setId, userId, loop) {
    const sql = 'INSERT INTO loops (set_id, user_id, description, start, end) VALUES (?, ?, ?, ?, ?)'
    return await queryAsync(sql, [setId, userId, loop.description, loop.start, loop.end]);
  },

  async updateLoop(loop) {
    const sql = 'UPDATE loops SET description=?, start=?, end=? WHERE (idloop=?)';
    return await queryAsync(sql, [loop.description.substring(0,30), loop.start, loop.end, loop.id])
  },
  
  async deleteLoop(id) {
    const sql = 'UPDATE loops SET deleted=NOW() WHERE (idloop=?)';
    return await queryAsync(sql, [id])
  }

}