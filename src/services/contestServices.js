export const contestService = {
  async getAll(storage) {
    return await storage.getAll('contests');
  },
  async getById(storage, id) {
    return await storage.get('contests', id);
  },
  async add(storage, contest) {
    // contest = { id, title, description, start, end, questions: [id,...]}
    return await storage.add('contests', contest);
  },
  async update(storage, id, data) {
    const contest = await storage.get('contests', id);
    if (!contest) throw new Error("Contest not found");
    const immutable = { id: contest.id }; // Ensure id is not changed
    return await storage.add('contests', { ...contest, ...data, ...immutable });
  },
  async remove(storage, id) {
    return await storage.remove('contests', id);
  }
};