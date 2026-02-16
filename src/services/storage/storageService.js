import { openSkillrackDB } from './indexedDB';

export function useStorage() {
  // This could be a React context/hook in real code. Here, just expose main methods.
  async function transaction(storeName, mode, cb) {
    const db = await openSkillrackDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([storeName], mode);
      const store = tx.objectStore(storeName);
      const req = cb(store);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  return {
    async getAll(storeName) {
      return transaction(storeName, 'readonly', store => store.getAll());
    },
    async get(storeName, id) {
      return transaction(storeName, 'readonly', store => store.get(id));
    },
    async add(storeName, value) {
      return transaction(storeName, 'readwrite', store => store.put(value));
    },
    async update(storeName, id, data) {
      return transaction(storeName, 'readwrite', store => {
        return store.get(id).onsuccess = function (event) {
          const record = event.target.result;
          if (record) {
            Object.assign(record, data);
            store.put(record);
          }
        };
      });
    },
    async remove(storeName, id) {
      return transaction(storeName, 'readwrite', store => store.delete(id));
    }
  }
}