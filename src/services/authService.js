import { runQuery } from '../lib/db';

export const authService = {
  async login(email, password) {
    const users = runQuery('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
    if (users.length === 0) {
      throw new Error("Invalid credentials");
    }
    const user = users[0];
    // Normalize admin flag
    return { ...user, admin: user.is_admin === 1 || user.is_admin === true || user.is_admin === 'true' };
  },

  async register(email, password, userData) {
    // Check if exists
    const existing = runQuery('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      throw new Error("User already exists");
    }

    const id = `user-${Date.now()}`;
    runQuery('INSERT INTO users (id, email, password, is_admin) VALUES (?, ?, ?, ?)',
      [id, email, password, false]);

    return { id, email, role: 'authenticated' };
  },

  async logout() {
    // Client-side only, nothing to do in stateless DB
  },

  async getUser() {
    // For this simple mock, we don't persist session in DB
    // The context/userStore.jsx handles the session state in React
    return null;
  }
};
