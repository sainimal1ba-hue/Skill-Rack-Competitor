import React, { useState, useEffect } from 'react';
import { chapterService } from '../../services/chapterService';
import { branchService } from '../../services/branchService';
import { Trash2, Plus, BookOpen } from 'lucide-react';

export default function AdminChapters() {
  const [chapters, setChapters] = useState([]);
  const [branches, setBranches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    branchId: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      const [chaptersData, branchesData] = await Promise.all([
        chapterService.getAll(),
        branchService.getAll()
      ]);
      setChapters(chaptersData || []);
      setBranches(branchesData || []);
    } catch (err) {
      console.error("Failed to load data", err);
    } finally {
      setIsLoading(false);
    }
  }

  const onChangeForm = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const addChapter = async () => {
    if (!form.name.trim() || !form.branchId) {
      alert("Name and Branch are required");
      return;
    }
    setIsLoading(true);
    try {
      await chapterService.add(form);
      setForm({ name: '', description: '', branchId: '' });
      loadData();
    } catch (e) {
      console.error(e);
      alert("Failed to add chapter");
    } finally {
      setIsLoading(false);
    }
  };

  const removeChapter = async (id) => {
    if (!window.confirm("Delete this chapter? Questions in it might be orphaned.")) return;
    await chapterService.remove(id);
    loadData();
  };

  const getBranchName = (id) => {
    const b = branches.find(b => b.id === id);
    return b ? b.name : id;
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
            Manage Chapters
          </h2>
          <p className="text-slate-400">Create new topics (chapters) inside branches</p>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-xl mb-8 animate-fade-in">
        <h3 className="text-lg font-semibold text-white mb-4 border-b border-slate-700 pb-2 flex items-center gap-2">
          <Plus className="w-5 h-5 text-indigo-400" />
          Add New Chapter
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium text-slate-400 mb-1">Select Branch</label>
            <select
              className="input-antigravity w-full px-3 py-2"
              name="branchId"
              value={form.branchId}
              onChange={onChangeForm}
            >
              <option value="">-- Select Branch --</option>
              {branches.map(b => (
                <option key={b.id} value={b.id}>{b.name} ({b.id})</option>
              ))}
            </select>
          </div>

          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium text-slate-400 mb-1">Chapter Name</label>
            <input
              className="input-antigravity w-full px-3 py-2"
              placeholder="e.g. Dynamic Programming"
              name="name"
              value={form.name}
              onChange={onChangeForm}
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
            <textarea
              className="input-antigravity w-full px-3 py-2 font-mono text-sm"
              placeholder="Description of this topic..."
              name="description"
              rows={2}
              value={form.description}
              onChange={onChangeForm}
            />
          </div>

          <div className="col-span-2 mt-2">
            <button className="btn-antigravity w-full flex justify-center items-center gap-2" onClick={addChapter}>
              <Plus className="w-5 h-5" />
              <span>Create Chapter</span>
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white mb-4">Existing Chapters</h3>
        {isLoading && chapters.length === 0 ? (
          <div className="text-center py-10 text-slate-500">Loading...</div>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {chapters.map(c => (
              <li key={c.id} className="glass-panel p-4 rounded-lg flex justify-between items-center group hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-500/20 rounded-lg">
                    <BookOpen className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-200">{c.name}</h4>
                    <p className="text-xs text-slate-500 font-mono flex items-center gap-1">
                      <span className="text-indigo-400">{getBranchName(c.branch_id || c.branchId)}</span>
                    </p>
                  </div>
                </div>
                <button
                  className="p-2 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded transition-colors"
                  onClick={() => removeChapter(c.id)}
                  title="Delete Chapter"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}