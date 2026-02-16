// Basic IndexedDB schema definition for branches, chapters, questions, contests, submissions, users.

export function openSkillrackDB() {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open('skillrackdb', 1);
    request.onupgradeneeded = function (event) {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('branches'))
        db.createObjectStore('branches', { keyPath: 'id', autoIncrement: false });
      if (!db.objectStoreNames.contains('chapters'))
        db.createObjectStore('chapters', { keyPath: 'id', autoIncrement: false });
      if (!db.objectStoreNames.contains('questions'))
        db.createObjectStore('questions', { keyPath: 'id', autoIncrement: false });
      if (!db.objectStoreNames.contains('contests'))
        db.createObjectStore('contests', { keyPath: 'id', autoIncrement: false });
      if (!db.objectStoreNames.contains('users'))
        db.createObjectStore('users', { keyPath: 'id', autoIncrement: false });
      if (!db.objectStoreNames.contains('submissions'))
        db.createObjectStore('submissions', { keyPath: 'id', autoIncrement: true });
    }
    request.onsuccess = function (event) {
      resolve(event.target.result);
    }
    request.onerror = function (event) {
      reject(event.target.error);
    }
  });
}