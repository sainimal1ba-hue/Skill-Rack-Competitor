import React, { useEffect, useState } from 'react';
import { branchService } from '../../services/branchService';
import { Link } from 'react-router-dom';

export default function BranchListPage() {
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    branchService.getAll().then(setBranches);
  }, []);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">All Branches</h1>
      <ul className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {branches.map(branch => (
          <li key={branch.id}>
            <Link to={`/practice/branches/${branch.id}`}>
              <div className="bg-white shadow rounded p-4 hover:shadow-lg transition">
                <h2 className="text-lg font-semibold">{branch.name}</h2>
                <p className="text-gray-500">{branch.description}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}