import { runQuery } from '../lib/db';

export const submissionService = {
  async getAll() {
    return runQuery('SELECT * FROM submissions ORDER BY created_at DESC');
  },

  async getById(id) {
    const res = runQuery('SELECT * FROM submissions WHERE id = ?', [id]);
    return res[0];
  },

  async getByUserAndContest(userId, contestId) {
    return runQuery('SELECT * FROM submissions WHERE user_id = ? AND contest_id = ?', [userId, contestId]);
  },

  async getUserSubmissions(userId) {
    // Join manually or use AlaSQL join if fully supported for this simple case. 
    // For now, simple select
    return runQuery('SELECT * FROM submissions WHERE user_id = ? ORDER BY created_at DESC', [userId]);
  },

  async getQuestionSubmissions(questionId) {
    return runQuery('SELECT * FROM submissions WHERE question_id = ? ORDER BY created_at DESC', [questionId]);
  },

  async add(submission) {
    const id = `sub-${Date.now()}`;
    const dbSubmission = {
      id,
      user_id: submission.userId,
      question_id: submission.questionId,
      contest_id: submission.contestId || null,
      code: submission.code,
      verdict: submission.verdict,
      language: submission.language
    };

    runQuery('INSERT INTO submissions (id, user_id, question_id, contest_id, code, language, verdict) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, dbSubmission.user_id, dbSubmission.question_id, dbSubmission.contest_id, dbSubmission.code, dbSubmission.language, dbSubmission.verdict]);

    return dbSubmission;
  }
};



