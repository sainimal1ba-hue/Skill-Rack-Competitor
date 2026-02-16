
import chaptersData from '../data/chapters.json';
import questionsData from '../data/questions.json';

// Transform initial data to match DB schema (camelCase -> snake_case where needed)
const initialChapters = chaptersData.map(c => ({
    id: c.id,
    name: c.name,
    description: c.description || '',
    branch_id: c.branchId,
    created_at: new Date().toISOString()
}));

const initialQuestions = questionsData.map(q => ({
    id: q.id,
    created_at: new Date().toISOString(),
    title: q.title,
    description: q.description,
    input_format: q.input,
    output_format: q.output,
    sample_input: q.sampleInput,
    sample_output: q.sampleOutput,
    chapter_id: q.chapterId,
    complexity: 'Medium',
    test_cases: q.testCases || [],
    total_submissions: 0,
    total_accepted: 0,
    acceptance_rate: 0.0
}));

class MockSupabaseClient {
    constructor() {
        // Load from localStorage if available
        const storedDB = localStorage.getItem('mockSupabaseDB');
        if (storedDB) {
            try {
                this.db = JSON.parse(storedDB);
                console.log("[MockSupabase] Loaded DB from localStorage");
            } catch (e) {
                console.error("[MockSupabase] Failed to parse localStorage DB", e);
                this.db = this._getInitialDB();
            }
        } else {
            this.db = this._getInitialDB();
            this._saveDB();
        }

        this.auth = {
            getUser: async () => ({ data: { user: null }, error: null }),
            getSession: async () => ({ data: { session: null }, error: null }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
            signInWithPassword: async ({ email, password }) => {
                if (email === 'admin' && password === 'Q!w2e3r4t5y6u7i8o9p0') {
                    return {
                        data: {
                            user: { id: 'admin-id', email: 'admin', role: 'authenticated', is_admin: true },
                            session: { access_token: 'mock-admin-token' }
                        },
                        error: null
                    };
                }
                return { data: { user: null, session: null }, error: { message: "Invalid login credentials" } };
            },
            signOut: async () => ({ error: null }),
        };
    }

    _getInitialDB() {
        return {
            chapters: [...initialChapters],
            questions: [...initialQuestions],
            submissions: []
        };
    }

    _saveDB() {
        localStorage.setItem('mockSupabaseDB', JSON.stringify(this.db));
    }

    from(table) {
        return new MockQueryBuilder(this.db[table] || [], table, this.db, () => this._saveDB());
    }

    async rpc(fnName, args) {
        console.log(`[MockSupabase] RPC Call: ${fnName}`, args);
        if (fnName === 'increment_question_stats') {
            const question = this.db.questions.find(q => q.id === args.q_id);
            if (question) {
                question.total_submissions = (question.total_submissions || 0) + 1;
                if (args.is_accepted) {
                    question.total_accepted = (question.total_accepted || 0) + 1;
                }
                question.acceptance_rate = (question.total_accepted / question.total_submissions) * 100;
                this._saveDB();
            }
            return { data: null, error: null };
        }
        return { data: null, error: null };
    }
}

class MockQueryBuilder {
    constructor(data, tableName, db, saveCallback) {
        this.data = data;
        this.tableName = tableName;
        this.db = db;
        this.saveCallback = saveCallback;
        this.error = null;
        this.singleResult = false;
    }

    select(columns = '*') {
        // Determine which columns to select
        // For simplicity in this mock, we'll return all if '*' is passed,
        // otherwise we might filter keys. But typically full logic isn't needed for mocks.
        // We clone the data to avoid reference issues during chain, but for read it's fine.
        return this;
    }

    // --- Filtering ---

    eq(column, value) {
        this.data = this.data.filter(item => item[column] === value);
        return this;
    }

    ilike(column, pattern) {
        const regex = new RegExp(pattern.replace(/%/g, '.*'), 'i');
        this.data = this.data.filter(item => regex.test(item[column]));
        return this;
    }

    in(column, values) {
        this.data = this.data.filter(item => values.includes(item[column]));
        return this;
    }

    // --- Ordering / Limiting ---

    order(column, { ascending = true } = {}) {
        this.data.sort((a, b) => {
            if (a[column] < b[column]) return ascending ? -1 : 1;
            if (a[column] > b[column]) return ascending ? 1 : -1;
            return 0;
        });
        return this;
    }

    limit(count) {
        this.data = this.data.slice(0, count);
        return this;
    }

    single() {
        this.singleResult = true;
        return this;
    }

    // --- Modifying Data ---

    insert(items) {
        const rows = Array.isArray(items) ? items : [items];
        const newRows = rows.map(row => ({
            ...row,
            id: row.id || `mock-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            created_at: new Date().toISOString()
        }));

        this.db[this.tableName].push(...newRows);

        if (this.saveCallback) this.saveCallback();

        // The return value of insert in Supabase depends on .select(), 
        // but usually we just want the data back if .select() is called.
        // We will store these to return them if .select is called (which we assume is always modifying this builder)
        this.data = newRows;

        return this;
    }

    update(updates) {
        // Access the original DB array to update in place
        const originalTable = this.db[this.tableName];
        const idsToUpdate = this.data.map(d => d.id);

        const updatedRows = [];

        for (let i = 0; i < originalTable.length; i++) {
            if (idsToUpdate.includes(originalTable[i].id)) {
                originalTable[i] = { ...originalTable[i], ...updates };
                updatedRows.push(originalTable[i]);
            }
        }

        if (this.saveCallback) this.saveCallback();

        this.data = updatedRows;
        return this;
    }

    delete() {
        const idsToDelete = this.data.map(d => d.id);
        this.db[this.tableName] = this.db[this.tableName].filter(item => !idsToDelete.includes(item.id));

        if (this.saveCallback) this.saveCallback();

        this.data = []; // Deleted
        return this;
    }

    // --- Final execution ---

    async then(resolve, reject) {
        // This allows the builder to be awaited like a Promise
        // We simulate the Supabase response format { data, error }

        let result = this.singleResult ? (this.data.length > 0 ? this.data[0] : null) : this.data;

        // Simulate slight delay
        await new Promise(r => setTimeout(r, 50));

        resolve({
            data: result,
            error: this.error,
            count: this.data.length // Simplified count
        });
    }
}

export const mockSupabase = new MockSupabaseClient();
