import React, { useEffect, useState } from 'react';
import { chapterService } from '../../services/chapterService';
import { useParams, Link } from 'react-router-dom';

export default function ChapterListPage() {
  const [chapters, setChapters] = useState([]);
  const { branchId } = useParams();

  useEffect(() => {
    chapterService.getAll().then(data => {
      // filter chapters by branch
      setChapters(data.filter(ch => ch.branch_id === branchId || ch.branchId === branchId));
    });
  }, [branchId]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Chapters in Branch</h1>
      <ul className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        {chapters.map(chapter => (
          <li key={chapter.id}>
            <Link to={`/practice/chapters/${chapter.id}`}>
              <div className="bg-white shadow rounded p-4 hover:shadow-lg transition">
                <h2 className="text-lg font-semibold">{chapter.name}</h2>
                <p className="text-gray-500">{chapter.description}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}