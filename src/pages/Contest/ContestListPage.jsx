import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStorage } from '../../services/storage/storageService';
import { contestService } from '../../services/contestServices';
import { Trophy, Calendar, Clock, Users } from 'lucide-react';

export default function ContestListPage() {
  const storage = useStorage();
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContests() {
      try {
        const data = await contestService.getAll(storage);
        setContests(data);
      } catch (error) {
        console.error('Failed to fetch contests:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchContests();
  }, [storage]);

  if (loading) {
    return <div className="container mx-auto py-8 text-center">Loading contests...</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center gap-3 mb-8">
        <Trophy className="w-8 h-8 text-yellow-500" />
        <h1 className="text-3xl font-bold">Coding Contests</h1>
      </div>

      {contests.length === 0 ? (
        <div className="card text-center py-12">
          <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No contests available at the moment</p>
          <p className="text-gray-400 mt-2">Check back later for upcoming contests</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {contests.map(contest => {
            const now = new Date();
            const start = new Date(contest.startTime);
            const end = new Date(contest.endTime);
            const isUpcoming = now < start;
            const isOngoing = now >= start && now <= end;
            const isEnded = now > end;

            return (
              <div key={contest.id} className="card hover:shadow-lg transition">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold">{contest.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    isUpcoming ? 'bg-blue-100 text-blue-700' :
                    isOngoing ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {isUpcoming ? 'Upcoming' : isOngoing ? 'Live' : 'Ended'}
                  </span>
                </div>

                <p className="text-gray-600 mb-4">{contest.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Starts: {start.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>Ends: {end.toLocaleString()}</span>
                  </div>
                </div>

                <Link
                  to={`/contest/lobby/${contest.id}`}
                  className={`btn w-full ${isOngoing ? 'btn-success' : 'btn-primary'}`}
                >
                  {isOngoing ? 'Enter Contest' : 'View Details'}
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
