import queryAsync from '../database.js';

export const loopsRepo = {
  async getLoops(setId, userId) {
    const sql = 'SELECT idloop AS id, start, end, description FROM loops WHERE set_id = ? AND user_id = ? AND deleted IS NULL;'
    return await queryAsync(sql, [setId, userId]);
  }
}