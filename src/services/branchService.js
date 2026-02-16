import { runQuery } from '../lib/db';

export const branchService = {
  async getAll() {
    return runQuery('SELECT * FROM branches');
  },
  async getById(id) {
    const res = runQuery('SELECT * FROM branches WHERE id = ?', [id]);
    return res[0];
  },
  async add(branch) {
    runQuery('INSERT INTO branches (id, name, description) VALUES (?, ?, ?)',
      [branch.id, branch.name, branch.description]);
    return branch;
  },
  async update(id, data) {
    runQuery('UPDATE branches SET name = ?, description = ? WHERE id = ?',
      [data.name, data.description, id]);
    return { id, ...data };
  },
  async remove(id) {
    runQuery('DELETE FROM branches WHERE id = ?', [id]);
    return true;
  }
};
