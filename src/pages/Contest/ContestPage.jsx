import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { contestService } from '../../services/contestServices';
import { questionService } from '../../services/questionService';
import { useStorage } from '../../services/storage/storageService';
import ContestTimer from '../../components/contest/ContestTimer';
import Leaderboard from '../../components/contest/Leaderboard';

export default function ContestPage() {
  const { contestId } = useParams();
  const storage = useStorage();
  const [contest, setContest] = useState(null);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    contestService.getById(storage, contestId).then(data => {
      setContest(data);
      // Load related questions
      if (data?.questionIds?.length > 0) {
        questionService.getAll(storage).then(qs => {
          setQuestions(qs.filter(q => data.questionIds.includes(q.id)));
        });
      }
    });
  }, [storage, contestId]);

  if (!contest) return <div>Loading contest...</div>;

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{contest.title}</h1>
        <p className="mb-2 text-gray-600">{contest.description}</p>
        <ContestTimer endTime={contest.endTime} />
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-2">Questions</h2>
        <ul className="list-disc pl-6">
          {questions.map(q => (
            <li key={q.id} className="mb-2">
              <span className="font-bold">{q.title}</span> {" "}
              <span className="inline-block text-xs ml-2 px-2 py-1 bg-gray-100 rounded">
                {q.difficulty}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-8">
        <Leaderboard contestId={contestId} />
      </div>
    </div>
  );
}