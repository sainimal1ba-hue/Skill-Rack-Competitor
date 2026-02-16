import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { contestService } from '../../services/contestServices';
import { useStorage } from '../../services/storage/storageService';

export default function ContestLobbyPage() {
  const { contestId } = useParams();
  const storage = useStorage();
  const [contest, setContest] = useState();

  useEffect(() => {
    contestService.getById(storage, contestId).then(setContest);
  }, [contestId, storage]);

  if (!contest) return <div>Loading contest lobby...</div>;

  return (
    <div className="container mx-auto py-8">
      <div className="bg-white shadow-lg p-6 rounded mb-6 max-w-xl mx-auto text-center">
        <h1 className="text-2xl font-bold">{contest.title}</h1>
        <div className="my-2 text-gray-600">{contest.description}</div>
        <p>
          <span className="inline-block bg-blue-200 px-2 py-1 rounded text-blue-800">
            Starts at: {new Date(contest.startTime).toLocaleString()}
          </span>
        </p>
        <p>
          <span className="inline-block bg-red-200 px-2 py-1 rounded text-red-800 mt-2">
            Ends at: {new Date(contest.endTime).toLocaleString()}
          </span>
        </p>
        <Link
          to={`/contest/${contestId}`}
          className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          Enter Contest
        </Link>
      </div>
    </div>
  );
}