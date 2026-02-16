import React, { useEffect, useState } from 'react';
import { submissionService } from '../../services/submissionService';
import { userService } from '../../services/userService';
import { useStorage } from '../../services/storage/storageService';
import { Trophy, Medal } from 'lucide-react';

export default function Leaderboard({ contestId }) {
  const storage = useStorage();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const submissions = await submissionService.getAll(storage);
        const users = await userService.getAll(storage);
        
        // Filter submissions for this contest
        const contestSubmissions = submissions.filter(s => s.contestId === contestId);
        
        // Calculate scores by user
        const userScores = {};
        contestSubmissions.forEach(sub => {
          if (!userScores[sub.userId]) {
            userScores[sub.userId] = {
              userId: sub.userId,
              solved: 0,
              totalTime: 0
            };
          }
          if (sub.verdict === 'Accepted') {
            userScores[sub.userId].solved += 1;
            userScores[sub.userId].totalTime += new Date(sub.createdAt).getTime();
          }
        });
        
        // Convert to array and sort
        const ranked = Object.values(userScores)
          .map(score => {
            const user = users.find(u => u.id === score.userId);
            return {
              ...score,
              name: user?.name || 'Unknown',
              email: user?.email || ''
            };
          })
          .sort((a, b) => {
            if (b.solved !== a.solved) return b.solved - a.solved;
            return a.totalTime - b.totalTime;
          });
        
        setLeaderboard(ranked);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchLeaderboard();
  }, [contestId, storage]);

  if (loading) {
    return <div className="text-center py-4">Loading leaderboard...</div>;
  }

  if (leaderboard.length === 0) {
    return <div className="text-center py-4 text-gray-500">No submissions yet</div>;
  }

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Trophy className="w-6 h-6 text-yellow-500" />
        Leaderboard
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-2 text-left">Rank</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-center">Solved</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, index) => (
              <tr key={entry.userId} className="border-b last:border-b-0 hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {index === 0 && <Medal className="w-5 h-5 text-yellow-500" />}
                    {index === 1 && <Medal className="w-5 h-5 text-gray-400" />}
                    {index === 2 && <Medal className="w-5 h-5 text-amber-600" />}
                    <span className="font-semibold">{index + 1}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium">{entry.name}</div>
                  <div className="text-sm text-gray-500">{entry.email}</div>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                    {entry.solved}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
