import React, { useState, useEffect } from 'react';
import { useStorage } from '../../services/storage/storageService';
import { contestService } from '../../services/contestServices';

export default function AdminContests() {
  const storage = useStorage();
  const [contests, setContests] = useState([]);
  const initialForm = {
    id: '',
    title: '',
    startTime: '',
    endTime: '',
    description: '',
    questionIds: ''
  };
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    contestService.getAll(storage).then(setContests);
  }, [storage]);

  const onChangeForm = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const save = async () => {
    if (!form.id.trim() || !form.title.trim() || !form.startTime.trim() || !form.endTime.trim()) return;
    const contest = {
      ...form,
      questionIds: form.questionIds.split(',').map(q => q.trim()).filter(Boolean)
    };
    await contestService.add(storage, contest);
    setForm(initialForm);
    setContests(await contestService.getAll(storage));
  };

  const del = async (id) => {
    await contestService.remove(storage, id);
    setContests(await contestService.getAll(storage));
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h2 className="text-xl font-bold mb-4">Manage Contests</h2>
      <div className="grid grid-cols-2 gap-2 mb-4">
        <input className="input" placeholder="Contest ID" name="id" value={form.id} onChange={onChangeForm} />
        <input className="input" placeholder="Title" name="title" value={form.title} onChange={onChangeForm} />
        <input className="input" type="datetime-local" name="startTime" value={form.startTime} onChange={onChangeForm} />
        <input className="input" type="datetime-local" name="endTime" value={form.endTime} onChange={onChangeForm} />
        <textarea className="input col-span-2" placeholder="Description" name="description" rows={2} value={form.description} onChange={onChangeForm} />
        <input className="input col-span-2" placeholder="Question IDs (comma separated)" name="questionIds" value={form.questionIds} onChange={onChangeForm} />
        <button className="btn btn-primary col-span-2" onClick={save}>Add Contest</button>
      </div>
      <ul className="divide-y">
        {contests.map(c => (
          <li key={c.id} className="py-3 flex justify-between items-center">
            <div>
              <div className="font-semibold">{c.id} - {c.title}</div>
              <div className="text-sm text-gray-600">
                {new Date(c.startTime).toLocaleString()} ~ {new Date(c.endTime).toLocaleString()}
              </div>
            </div>
            <button className="btn btn-danger" onClick={() => del(c.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}