import React, { useEffect, useState } from 'react';
import { submissionService } from '../../services/submissionService';
import { useUser } from '../../context/userStore.jsx';
import { CheckCircle, AlertCircle, Clock, Calendar, Code, ArrowRight, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SubmissionHistoryPage() {
  const { user } = useUser();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadSubmissions();
    }
  }, [user]);

  async function loadSubmissions() {
    setLoading(true);
    try {
      const data = await submissionService.getUserSubmissions(user.id);
      setSubmissions(data || []);
    } catch (err) {
      console.error("Failed to load submissions", err);
    } finally {
      setLoading(false);
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString() + ' ' + new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Submissions</h1>
          <p className="text-slate-400">Track your coding journey and progress</p>
        </div>
        <div className="flex gap-4">
          <div className="px-4 py-2 bg-slate-800 rounded-lg border border-slate-700">
            <span className="text-2xl font-bold text-white block text-center">{submissions.length}</span>
            <span className="text-xs text-slate-500 uppercase tracking-wider">Total</span>
          </div>
          <div className="px-4 py-2 bg-slate-800 rounded-lg border border-slate-700">
            <span className="text-2xl font-bold text-emerald-400 block text-center">
              {submissions.filter(s => s.verdict === 'Accepted').length}
            </span>
            <span className="text-xs text-slate-500 uppercase tracking-wider">Accepted</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      ) : submissions.length === 0 ? (
        <div className="text-center py-20 glass-panel rounded-xl">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Code className="w-8 h-8 text-slate-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-300 mb-2">No submissions yet</h3>
          <p className="text-slate-500 mb-6">Start solving problems to see your history here!</p>
          <Link to="/practice" className="btn-antigravity px-6 py-2">
            Start Practicing
          </Link>
        </div>
      ) : (
        <div className="glass-panel overflow-hidden rounded-xl border border-slate-700/50">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800/80 border-b border-slate-700">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Verdict</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Question</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Language</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {submissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${sub.verdict === 'Accepted'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : sub.verdict === 'Wrong Answer'
                            ? 'bg-red-500/10 text-red-400 border-red-500/20'
                            : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                        }`}>
                        {sub.verdict === 'Accepted' && <CheckCircle className="w-3 h-3" />}
                        {sub.verdict === 'Wrong Answer' && <AlertCircle className="w-3 h-3" />}
                        {sub.verdict}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-200">
                        {sub.questions?.title || 'Unknown Question'}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {sub.questions?.complexity || 'Medium'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs text-slate-400 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                        {sub.language}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3 text-slate-600" />
                        {formatDate(sub.created_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/practice/questions/${sub.question_id}`}
                        className="text-indigo-400 hover:text-indigo-300 text-sm font-medium inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Retry <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}