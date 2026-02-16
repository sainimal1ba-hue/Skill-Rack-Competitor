
import alasql from 'alasql';
import databaseSql from '../data/database.sql?raw'; // Import raw SQL content

// Initialize AlaSQL Database
export const initDB = () => {
    // Check if DB is already initialized in localStorage
    const savedData = localStorage.getItem('alasql_db');

    if (savedData) {
        try {
            // Restore from localStorage
            alasql.databases = JSON.parse(savedData);
            console.log("Restored database from localStorage");
        } catch (e) {
            console.error("Failed to restore DB, resetting...", e);
            resetDB();
        }
    } else {
        resetDB();
    }

    // Attach autosave hook
    // Primitive autosave: save after every query execution? 
    // better to wrap runQuery.
};

const resetDB = () => {
    alasql('CREATE DATABASE IF NOT EXISTS skillrack');
    alasql('USE skillrack');
    // Split by semicolon and run each statement
    const statements = databaseSql.split(';').filter(s => s.trim().length > 0);
    for (const stmt of statements) {
        alasql(stmt);
    }
    saveDB();
    console.log("Initialized new database from SQL file");
};

const saveDB = () => {
    // alasql.databases serialization might be tricky.
    // A better approach for alasql in browser is to just let it hold memory
    // and we manually export/import tables using its built-in features if needed.
    // However, alasql does not serialize the whole DB object easily back to JSON for localStorage.
    // We will save specific tables we care about.

    // Actually, Alasql has a 'localStorage' engine but it's often simpler to just manage JSONs.
    // Let's rely on in-memory for the session and maybe dump tables to localStorage.

    const tables = ['users', 'chapters', 'questions', 'submissions'];
    const dump = {};
    tables.forEach(t => {
        dump[t] = alasql(`SELECT * FROM ${t}`);
    });
    localStorage.setItem('skillrack_tables', JSON.stringify(dump));
};

export const restoreTables = () => {
    alasql('CREATE DATABASE IF NOT EXISTS skillrack');
    alasql('USE skillrack');

    const saved = localStorage.getItem('skillrack_tables');
    if (saved) {
        const dump = JSON.parse(saved);
        // We need to ensure schema exists first, so run the SQL file first
        const statements = databaseSql.split(';').filter(s => s.trim().length > 0);
        for (const stmt of statements) {
            try { alasql(stmt); } catch (e) { } // Ignore errors if tables already exist
        }

        // Now Repopulate
        Object.keys(dump).forEach(table => {
            alasql(`DELETE FROM ${table}`); // Clear seed data
            if (dump[table].length > 0) {
                alasql(`INSERT INTO ${table} SELECT * FROM ?`, [dump[table]]);
            }
        });
    } else {
        // First run
        const statements = databaseSql.split(';').filter(s => s.trim().length > 0);
        for (const stmt of statements) {
            alasql(stmt);
        }
    }
};

export const runQuery = (sql, params = []) => {
    // Ensure DB is selected
    alasql('USE skillrack');
    const result = alasql(sql, params);

    if (sql.trim().toUpperCase().startsWith('INSERT') ||
        sql.trim().toUpperCase().startsWith('UPDATE') ||
        sql.trim().toUpperCase().startsWith('DELETE')) {
        saveDB();
    }

    return result;
};

// Initialize immediately
restoreTables();
