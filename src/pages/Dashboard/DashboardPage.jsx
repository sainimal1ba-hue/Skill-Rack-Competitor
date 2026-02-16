import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../context/userStore.jsx';
import { submissionService } from '../../services/submissionService';
import { Code2, Trophy, BookOpen, TrendingUp, CheckCircle, XCircle, Activity } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useUser();
  const [stats, setStats] = useState({
    totalSubmissions: 0,
    acceptedSubmissions: 0,
    recentSubmissions: []
  });

  useEffect(() => {
    async function fetchStats() {
      if (!user) return;

      try {
        const submissions = await submissionService.getAll();
        const userSubmissions = submissions.filter(s => s.user_id === user.id);
        const accepted = userSubmissions.filter(s => s.verdict === 'Accepted');
        const recent = userSubmissions
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 5);

        setStats({
          totalSubmissions: userSubmissions.length,
          acceptedSubmissions: accepted.length,
          recentSubmissions: recent
        });
      } catch (err) {
        console.error("Failed to load stats", err);
      }
    }

    fetchStats();
  }, [user]);

  if (!user) return null;

  const successRate = stats.totalSubmissions > 0
    ? Math.round((stats.acceptedSubmissions / stats.totalSubmissions) * 100)
    : 0;

  return (
    <div className="container mx-auto py-8 px-4 animate-fade-in">
      {/* Welcome Section */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
            Welcome back, {user.email.split('@')[0]}!
          </h1>
          <p className="text-slate-400">Here's your coding progress overview</p>
        </div>
        {user.admin && (
          <div className="flex gap-2">
            <Link to="/admin/questions" className="btn-antigravity px-4 py-2 flex items-center gap-2 text-sm">
              <Code2 className="w-4 h-4" /> Manage Questions
            </Link>
            <Link to="/admin/branches" className="btn-antigravity px-4 py-2 flex items-center gap-2 text-sm">
              <BookOpen className="w-4 h-4" /> Manage Branches
            </Link>
            <Link to="/admin/chapters" className="btn-antigravity px-4 py-2 flex items-center gap-2 text-sm">
              <BookOpen className="w-4 h-4" /> Manage Chapters
            </Link>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="glass-panel p-6 rounded-xl relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 bg-blue-500/10 w-24 h-24 rounded-full group-hover:bg-blue-500/20 transition-all"></div>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-slate-400 text-sm mb-1">Total Submissions</p>
              <p className="text-3xl font-bold text-white">{stats.totalSubmissions}</p>
            </div>
            <Code2 className="w-10 h-10 text-blue-400" />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-xl relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 bg-green-500/10 w-24 h-24 rounded-full group-hover:bg-green-500/20 transition-all"></div>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-slate-400 text-sm mb-1">Accepted</p>
              <p className="text-3xl font-bold text-green-400">{stats.acceptedSubmissions}</p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-xl relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 bg-purple-500/10 w-24 h-24 rounded-full group-hover:bg-purple-500/20 transition-all"></div>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-slate-400 text-sm mb-1">Success Rate</p>
              <p className="text-3xl font-bold text-purple-400">{successRate}%</p>
            </div>
            <TrendingUp className="w-10 h-10 text-purple-400" />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-xl relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 bg-yellow-500/10 w-24 h-24 rounded-full group-hover:bg-yellow-500/20 transition-all"></div>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-slate-400 text-sm mb-1">Rank</p>
              <p className="text-3xl font-bold text-yellow-500">-</p>
            </div>
            <Trophy className="w-10 h-10 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Link to="/practice" className="glass-panel p-6 rounded-xl hover:bg-slate-800/50 transition cursor-pointer group border-l-4 border-l-blue-500">
          <div className="flex items-center gap-4">
            <div className="bg-blue-500/20 p-4 rounded-lg group-hover:scale-110 transition-transform">
              <BookOpen className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">Practice Problems</h3>
              <p className="text-slate-400">Browse and solve coding challenges</p>
            </div>
          </div>
        </Link>

        <Link to="/contests" className="glass-panel p-6 rounded-xl hover:bg-slate-800/50 transition cursor-pointer group border-l-4 border-l-purple-500">
          <div className="flex items-center gap-4">
            <div className="bg-purple-500/20 p-4 rounded-lg group-hover:scale-110 transition-transform">
              <Trophy className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">Live Contests</h3>
              <p className="text-slate-400">Compete and improve your ranking</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Submissions */}
      <div className="glass-panel p-6 rounded-xl">
        <div className="flex items-center gap-2 mb-6">
          <Activity className="w-5 h-5 text-indigo-400" />
          <h2 className="text-xl font-bold text-white">Recent Submissions</h2>
        </div>

        {stats.recentSubmissions.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-slate-700 rounded-lg">
            <p className="text-slate-500">No submissions yet. Start practicing!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="px-4 py-3 text-left text-slate-400 font-medium text-sm">Question ID</th>
                  <th className="px-4 py-3 text-left text-slate-400 font-medium text-sm">Language</th>
                  <th className="px-4 py-3 text-left text-slate-400 font-medium text-sm">Verdict</th>
                  <th className="px-4 py-3 text-left text-slate-400 font-medium text-sm">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {stats.recentSubmissions.map((sub, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-slate-300 text-sm">
                      {sub.question_id ? sub.question_id.substring(0, 8) : 'Unknown'}
                    </td>
                    <td className="px-4 py-3 text-slate-300 capitalize text-sm">{sub.language}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${sub.verdict === 'Accepted'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}>
                        {sub.verdict === 'Accepted' ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        {sub.verdict}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-sm">
                      {new Date(sub.created_at || sub.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
