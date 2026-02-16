export const userService = {
  async getAll(storage) {
    return await storage.getAll("users");
  },
  async getById(storage, id) {
    return await storage.get("users", id);
  },
  async add(storage, user) {
    return await storage.add("users", user);
  },
  async update(storage, id, data) {
    // Keep id and email immutable by admin panel logic
    const user = await storage.get("users", id);
    if (!user) throw new Error("User not found");
    const immutable = { id: user.id, email: user.email };
    return await storage.add("users", { ...user, ...data, ...immutable });
  },
  async remove(storage, id) {
    return await storage.remove("users", id);
  }
};