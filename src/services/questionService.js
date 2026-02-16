import { runQuery } from '../lib/db';

export const questionService = {
  async getAll() {
    return runQuery('SELECT * FROM questions ORDER BY created_at DESC');
  },

  async getById(id) {
    const res = runQuery('SELECT * FROM questions WHERE id = ?', [id]);
    return res[0];
  },

  async getByChapter(chapterId) {
    return runQuery('SELECT * FROM questions WHERE chapter_id = ?', [chapterId]);
  },

  async getByDifficulty(level) {
    return runQuery('SELECT * FROM questions WHERE complexity = ?', [level]);
  },

  async searchByTitle(keyword) {
    return runQuery('SELECT * FROM questions WHERE title LIKE ?', [`%${keyword}%`]);
  },

  async incrementStats(id, isAccepted) {
    runQuery(`
        UPDATE questions 
        SET total_submissions = total_submissions + 1,
            total_accepted = total_accepted + ?,
            acceptance_rate = (total_accepted + ?) / (total_submissions + 1) * 100
        WHERE id = ?
    `, [isAccepted ? 1 : 0, isAccepted ? 1 : 0, id]);
  },

  async add(question) {
    const id = `q-${Date.now()}`;
    const dbQuestion = {
      id,
      title: question.title,
      description: question.description,
      input_format: question.input,
      output_format: question.output,
      sample_input: question.sampleInput,
      sample_output: question.sampleOutput,
      chapter_id: question.chapterId,
      complexity: 'Medium',
      test_cases: JSON.stringify(question.testCases || []),
      hints: JSON.stringify(question.hints || []),
      solution_code: question.solutionCode || '',
      time_limit: question.timeLimit || 2000,
      memory_limit: question.memoryLimit || 256
    };

    runQuery(`INSERT INTO questions (
        id, title, description, input_format, output_format, sample_input, sample_output, chapter_id, complexity, test_cases, hints, solution_code, time_limit, memory_limit
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
      dbQuestion.id, dbQuestion.title, dbQuestion.description, dbQuestion.input_format, dbQuestion.output_format,
      dbQuestion.sample_input, dbQuestion.sample_output, dbQuestion.chapter_id, dbQuestion.complexity, dbQuestion.test_cases,
      dbQuestion.hints, dbQuestion.solution_code, dbQuestion.time_limit, dbQuestion.memory_limit
    ]);

    return dbQuestion;
  },

  async update(id, question) {
    runQuery(`UPDATE questions SET 
        title = ?, description = ?, input_format = ?, output_format = ?, sample_input = ?, sample_output = ?, chapter_id = ?,
        hints = ?, solution_code = ?, time_limit = ?, memory_limit = ?
        WHERE id = ?`,
      [question.title, question.description, question.input, question.output, question.sampleInput, question.sampleOutput,
      question.chapterId, JSON.stringify(question.hints || []), question.solutionCode || '', question.timeLimit, question.memoryLimit, id]);
    return { id, ...question };
  },

  async remove(id) {
    runQuery('DELETE FROM questions WHERE id = ?', [id]);
    return true;
  }
};

