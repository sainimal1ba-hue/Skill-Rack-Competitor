export const skillAnalysisService = {
  async analyzeUserSkills(storage, userId) {
    const submissions = await storage.getAll('submissions');
    const userSubs = submissions.filter((s) => s.userId === userId && s.verdict === 'Accepted');
    const stats = {};
    userSubs.forEach(sub => {
      if (!stats[sub.branchId]) stats[sub.branchId] = { solved: 0, questions: new Set() };
      stats[sub.branchId].solved += 1;
      stats[sub.branchId].questions.add(sub.questionId);
    });
    // Convert questions Set to list for serialization
    Object.keys(stats).forEach(k => stats[k].questions = Array.from(stats[k].questions));
    return stats;
  },
  async weakestChapters(storage, userId) {
    const submissions = await storage.getAll('submissions');
    const userSubs = submissions.filter((s) => s.userId === userId);
    const failCounts = {};
    userSubs.forEach(sub => {
      if (sub.verdict !== 'Accepted') {
        failCounts[sub.chapterId] = (failCounts[sub.chapterId] || 0) + 1;
      }
    });
    return Object.entries(failCounts)
      .map(([chapterId, fails]) => ({ chapterId, fails }))
      .sort((a, b) => b.fails - a.fails);
  }
};