// [Reinserted as a sanity, since it is the main glue for branches/chapters/questions]
import { branchService } from "./branchService";
import { chapterService } from "./chapterService";
import { questionService } from "./questionService";

export const contentService = {
  async getAllBranches(storage) {
    return await branchService.getAll(storage);
  },
  async getAllChapters(storage) {
    return await chapterService.getAll(storage);
  },
  async getChaptersByBranch(storage, branchId) {
    const chapters = await chapterService.getAll(storage);
    return chapters.filter(c => c.branchId === branchId);
  },
  async getQuestionsByChapter(storage, chapterId) {
    const questions = await questionService.getAll(storage);
    return questions.filter(q => q.chapterId === chapterId);
  },
  async getQuestionsByBranch(storage, branchId) {
    const questions = await questionService.getAll(storage);
    return questions.filter(q => q.branchId === branchId);
  }
};