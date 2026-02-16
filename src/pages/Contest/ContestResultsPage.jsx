import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { contestService } from '../../services/contestServices';
import { useStorage } from '../../services/storage/storageService';
import Leaderboard from '../../components/contest/Leaderboard';

export default function ContestResultsPage() {
  const { contestId } = useParams();
  const storage = useStorage();
  const [contest, setContest] = useState();

  useEffect(() => {
    contestService.getById(storage, contestId).then(setContest);
  }, [contestId, storage]);

  if (!contest) return <div>Loading results...</div>;

  return (
    <div className="container mx-auto py-8">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">{contest.title} - Final Results</h1>
        <p className="text-gray-600">{contest.description}</p>
      </div>
      <Leaderboard contestId={contestId} showFinal={true} />
    </div>
  );
}