import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { branchService } from '../../services/branchService';

// Restrict to admin usage - manual entry.
export default function AdminBranches() {
  const [branches, setBranches] = useState([]);
  const [name, setName] = useState('');
  const [id, setId] = useState('');

  useEffect(() => {
    branchService.getAll().then(setBranches);
  }, []);

  const addBranch = async () => {
    if (!id.trim() || !name.trim()) return;
    try {
      await branchService.add({ id, name, description: '' });
      setId('');
      setName('');
      setBranches(await branchService.getAll());
    } catch (e) {
      console.error("Failed to add branch", e);
      alert("Failed to add branch");
    }
  };

  const removeBranch = async (branchId) => {
    if (!window.confirm("Verify: Delete this branch?")) return;
    await branchService.remove(branchId);
    setBranches(await branchService.getAll());
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
            Manage Branches
          </h2>
          <p className="text-slate-400">Create new main branches (e.g. CSE, ECE)</p>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-xl mb-8 animate-fade-in">
        <h3 className="text-lg font-semibold text-white mb-4 border-b border-slate-700 pb-2">Add New Branch</h3>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              className="input-antigravity w-full px-3 py-2"
              placeholder="Branch ID (e.g. cse)"
              value={id}
              onChange={e => setId(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <input
              className="input-antigravity w-full px-3 py-2"
              placeholder="Branch Name (e.g. Computer Science)"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
          <button className="btn-antigravity px-6 py-2" onClick={addBranch}>
            Add Branch
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white mb-4">Existing Branches</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {branches.map(b => (
            <li key={b.id} className="glass-panel p-4 rounded-lg flex justify-between items-center group hover:bg-slate-800/50 transition-colors">
              <div>
                <h4 className="font-semibold text-slate-200">{b.name}</h4>
                <p className="text-xs text-slate-500 font-mono uppercase">{b.id}</p>
              </div>
              <div className="flex gap-2">
                <Link to="/admin/chapters" className="px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded hover:bg-indigo-500/20 transition-colors text-sm border border-indigo-500/20">
                  + Sub-Branch
                </Link>
                <button className="px-3 py-1 bg-red-500/10 text-red-400 rounded hover:bg-red-500/20 transition-colors text-sm border border-red-500/20" onClick={() => removeBranch(b.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}