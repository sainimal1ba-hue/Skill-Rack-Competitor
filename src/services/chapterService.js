import { runQuery } from '../lib/db';

export const chapterService = {
  async getAll() {
    return runQuery('SELECT * FROM chapters ORDER BY name');
  },

  async getById(id) {
    const res = runQuery('SELECT * FROM chapters WHERE id = ?', [id]);
    return res[0];
  },

  async getByBranch(branchId) {
    return runQuery('SELECT * FROM chapters WHERE branch_id = ?', [branchId]);
  },

  async add(chapter) {
    const id = `ch-${Date.now()}`;
    const dbChapter = {
      id,
      name: chapter.name,
      description: chapter.description,
      branch_id: chapter.branchId
    };

    runQuery('INSERT INTO chapters (id, name, description, branch_id) VALUES (?, ?, ?, ?)',
      [id, dbChapter.name, dbChapter.description, dbChapter.branch_id]);

    return dbChapter;
  },

  async update(id, chapter) {
    runQuery('UPDATE chapters SET name = ?, description = ?, branch_id = ? WHERE id = ?',
      [chapter.name, chapter.description, chapter.branchId, id]);
    return { id, ...chapter };
  },

  async remove(id) {
    runQuery('DELETE FROM chapters WHERE id = ?', [id]);
    return true;
  }
};

