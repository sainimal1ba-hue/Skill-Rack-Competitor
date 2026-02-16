import React, { useState, useEffect } from 'react';
import { branchService } from '../../services/branchService';
import { questionService } from '../../services/questionService';
import { chapterService } from '../../services/chapterService';
import { Trash2, Plus, Code, Lightbulb, FileText, CheckCircle } from 'lucide-react';

// Administrator must provide full question details manually
export default function AdminQuestions() {
  const [questions, setQuestions] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    chapterId: '',
    title: '',
    complexity: 'Medium',
    description: '',
    input: '',
    output: '',
    sampleInput: '',
    sampleOutput: '',
    testCases: '',
    hints: '',
    solutionCode: '',
    timeLimit: 2000,
    memoryLimit: 256
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      const questionsData = await questionService.getAll();
      setQuestions(questionsData || []);

      try {
        const [chaptersData, branchesData] = await Promise.all([
          chapterService.getAll(),
          branchService.getAll()
        ]);
        setChapters(chaptersData || []);
        setBranches(branchesData || []);
      } catch (e) {
        console.warn("Failed to load aux data", e);
      }
    } catch (err) {
      console.error("Failed to load questions", err);
    } finally {
      setIsLoading(false);
    }
  }

  const onChangeForm = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const addQuestion = async () => {
    if (!form.title.trim()) {
      alert("Title is required");
      return;
    }

    let parsedTestCases = [];
    if (form.testCases && form.testCases.trim()) {
      try {
        parsedTestCases = JSON.parse(form.testCases);
        if (!Array.isArray(parsedTestCases)) throw new Error("Not an array");
      } catch (e) {
        alert("Invalid Test Cases JSON. Must be an array.");
        return;
      }
    }

    let parsedHints = [];
    if (form.hints && form.hints.trim()) {
      try {
        parsedHints = JSON.parse(form.hints);
        if (!Array.isArray(parsedHints)) throw new Error("Not an array");
      } catch (e) {
        alert("Invalid Hints JSON. Must be an array of strings.");
        return;
      }
    }

    // Optimistic UI or wait for reload
    await questionService.add({
      ...form,
      testCases: parsedTestCases,
      hints: parsedHints
    });

    setForm({
      chapterId: '',
      title: '',
      complexity: 'Medium',
      description: '',
      input: '',
      output: '',
      sampleInput: '',
      sampleOutput: '',
      testCases: '',
      hints: '',
      solutionCode: '',
      timeLimit: 2000,
      memoryLimit: 256
    });

    loadData();
  };

  const removeQuestion = async (questionId) => {
    if (!window.confirm("Are you sure?")) return;
    await questionService.remove(questionId);
    loadData();
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
            Manage Problems
          </h2>
          <p className="text-slate-400">Create and edit coding problems for students</p>
        </div>
        <div className="p-2 bg-slate-800 rounded-lg border border-slate-700">
          <span className="text-slate-300 text-sm font-medium px-2">Total Questions: {questions.length}</span>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-xl mb-8 animate-fade-in">
        <h3 className="text-lg font-semibold text-white mb-4 border-b border-slate-700 pb-2 flex items-center gap-2">
          <Plus className="w-5 h-5 text-indigo-400" />
          Create New Problem
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium text-slate-400 mb-1">Branch (Filter)</label>
            <select
              className="input-antigravity w-full px-3 py-2"
              value={selectedBranch}
              onChange={e => {
                setSelectedBranch(e.target.value);
                setForm({ ...form, chapterId: '' }); // Reset chapter when branch changes
              }}
            >
              <option value="">-- Select Branch --</option>
              {branches.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>

          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium text-slate-400 mb-1">Chapter (Sub-Branch)</label>
            <select
              className="input-antigravity w-full px-3 py-2"
              name="chapterId"
              value={form.chapterId}
              onChange={onChangeForm}
              disabled={!selectedBranch}
            >
              <option value="">{selectedBranch ? "-- Select Chapter --" : "-- Select Branch First --"}</option>
              {chapters
                .filter(c => !selectedBranch || (c.branch_id === selectedBranch || c.branchId === selectedBranch))
                .map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
            </select>
          </div>

          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium text-slate-400 mb-1">Title</label>
            <input
              className="input-antigravity w-full px-3 py-2"
              placeholder="e.g. Two Sum"
              name="title"
              value={form.title}
              onChange={onChangeForm}
            />
          </div>

          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium text-slate-400 mb-1">Difficulty</label>
            <select
              className="input-antigravity w-full px-3 py-2"
              name="complexity"
              value={form.complexity}
              onChange={onChangeForm}
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium text-slate-400 mb-1">Time Limit (ms)</label>
            <input
              type="number"
              className="input-antigravity w-full px-3 py-2"
              placeholder="2000"
              name="timeLimit"
              value={form.timeLimit}
              onChange={onChangeForm}
            />
          </div>

          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium text-slate-400 mb-1">Memory Limit (MB)</label>
            <input
              type="number"
              className="input-antigravity w-full px-3 py-2"
              placeholder="256"
              name="memoryLimit"
              value={form.memoryLimit}
              onChange={onChangeForm}
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
            <textarea
              className="input-antigravity w-full px-3 py-2 font-mono text-sm"
              placeholder="Problem description..."
              name="description"
              rows={3}
              value={form.description}
              onChange={onChangeForm}
            />
          </div>

          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium text-slate-400 mb-1">Input Format</label>
            <input
              className="input-antigravity w-full px-3 py-2"
              placeholder="e.g. Two integers"
              name="input"
              value={form.input}
              onChange={onChangeForm}
            />
          </div>

          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium text-slate-400 mb-1">Output Format</label>
            <input
              className="input-antigravity w-full px-3 py-2"
              placeholder="e.g. Sum of integers"
              name="output"
              value={form.output}
              onChange={onChangeForm}
            />
          </div>

          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium text-slate-400 mb-1">Sample Input</label>
            <textarea
              className="input-antigravity w-full px-3 py-2 font-mono text-sm"
              placeholder="1 2"
              name="sampleInput"
              rows={2}
              value={form.sampleInput}
              onChange={onChangeForm}
            />
          </div>

          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium text-slate-400 mb-1">Sample Output</label>
            <textarea
              className="input-antigravity w-full px-3 py-2 font-mono text-sm"
              placeholder="3"
              name="sampleOutput"
              rows={2}
              value={form.sampleOutput}
              onChange={onChangeForm}
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-400 mb-1 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              Test Cases (JSON List)
            </label>
            <textarea
              className="input-antigravity w-full px-3 py-2 font-mono text-xs"
              placeholder='[{"input": "1 2", "output": "3"}, {"input": "5 10", "output": "15"}]'
              name="testCases"
              rows={4}
              value={form.testCases || ''}
              onChange={onChangeForm}
            />
            <p className="text-xs text-slate-500 mt-1">Optional. Must be valid JSON array.</p>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-400 mb-1 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-yellow-400" />
              Hints (JSON List)
            </label>
            <textarea
              className="input-antigravity w-full px-3 py-2 font-mono text-xs"
              placeholder='["Use a hash map to store visited numbers", "Iterate once"]'
              name="hints"
              rows={2}
              value={form.hints || ''}
              onChange={onChangeForm}
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-400 mb-1 flex items-center gap-2">
              <Code className="w-4 h-4 text-blue-400" />
              Solution Code
            </label>
            <textarea
              className="input-antigravity w-full px-3 py-2 font-mono text-xs"
              placeholder='// Full solution code here...'
              name="solutionCode"
              rows={6}
              value={form.solutionCode || ''}
              onChange={onChangeForm}
            />
          </div>

          <div className="col-span-2 mt-2">
            <button className="btn-antigravity w-full flex justify-center items-center gap-2" onClick={addQuestion}>
              <Plus className="w-5 h-5" />
              <span>Create Problem</span>
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white mb-4">Question List</h3>
        {isLoading ? (
          <div className="text-center py-10 text-slate-500">Loading questions...</div>
        ) : questions.length === 0 ? (
          <div className="text-center py-10 glass-panel rounded-xl text-slate-500">
            No questions found. Add one above!
          </div>
        ) : (
          <ul className="space-y-3">
            {questions.map(q => (
              <li key={q.id} className="glass-panel p-4 rounded-lg flex justify-between items-center group hover:bg-slate-800/50 transition-colors">
                <div>
                  <h4 className="font-semibold text-slate-200">{q.title}</h4>
                  <p className="text-xs text-slate-500 font-mono mt-1">{q.id}</p>
                </div>
                <button
                  className="px-3 py-1 bg-red-500/10 text-red-400 rounded hover:bg-red-500/20 transition-colors text-sm border border-red-500/20 flex items-center gap-1"
                  onClick={() => removeQuestion(q.id)}
                >
                  <Trash2 className="w-3 h-3" />
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
