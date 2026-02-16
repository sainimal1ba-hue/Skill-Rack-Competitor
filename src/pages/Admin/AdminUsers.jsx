import React, { useState, useEffect } from 'react';
import { useStorage } from '../../services/storage/storageService';

// Assume you want basic user management by admin
export default function AdminUsers() {
  const storage = useStorage();
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ id: '', name: '', email: '' });

  useEffect(() => {
    storage.getAll('users').then(setUsers);
  }, [storage]);

  const onChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const addUser = async () => {
    if (!form.id.trim() || !form.name.trim() || !form.email.trim()) return;
    await storage.add('users', form);
    setForm({ id: '', name: '', email: '' });
    setUsers(await storage.getAll('users'));
  };

  const removeUser = async (id) => {
    await storage.remove('users', id);
    setUsers(await storage.getAll('users'));
  };

  return (
    <div className="max-w-xl mx-auto py-8">
      <h2 className="text-xl font-bold mb-4">Manage Users</h2>
      <div className="flex space-x-2 mb-4">
        <input className="input" placeholder="User ID" name="id" value={form.id} onChange={onChange} />
        <input className="input" placeholder="Name" name="name" value={form.name} onChange={onChange} />
        <input className="input" placeholder="Email" name="email" value={form.email} onChange={onChange} />
        <button className="btn btn-primary" onClick={addUser}>Add</button>
      </div>
      <ul className="divide-y">
        {users.map(u => (
          <li key={u.id} className="py-2 flex justify-between">
            <span>{u.id} - {u.name} - {u.email}</span>
            <button className="btn btn-danger" onClick={() => removeUser(u.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}