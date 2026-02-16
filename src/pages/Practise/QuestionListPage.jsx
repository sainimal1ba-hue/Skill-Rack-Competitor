import React, { useEffect, useState } from 'react';
import { questionService } from '../../services/questionService';
import { useParams, Link } from 'react-router-dom';
import { Search, Filter, BarChart, ChevronRight, BookOpen, Star } from 'lucide-react';

export default function QuestionListPage() {
  const { chapterId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [difficulty, setDifficulty] = useState("All");

  useEffect(() => {
    loadQuestions();
  }, [chapterId]);

  useEffect(() => {
    filterQuestions();
  }, [searchQuery, difficulty, questions]);

  async function loadQuestions() {
    setLoading(true);
    try {
      // Fetch all for chapter, then client-side filter for speed on small datasets
      // Or use service methods if we want server-side. 
      // For now, fetching by chapter is primary.
      const data = await questionService.getByChapter(chapterId);
      setQuestions(data || []);
    } catch (err) {
      console.error("Failed to load questions", err);
    } finally {
      setLoading(false);
    }
  }

  function filterQuestions() {
    let res = questions;

    if (difficulty !== "All") {
      res = res.filter(q => q.complexity === difficulty);
    }

    if (searchQuery.trim()) {
      const lowerQ = searchQuery.toLowerCase();
      res = res.filter(q => q.title.toLowerCase().includes(lowerQ));
    }

    setFilteredQuestions(res);
  }

  const getDifficultyColor = (diff) => {
    switch (diff) {
      case 'Easy': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'Hard': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-indigo-400" />
            Chapter Problems
          </h1>
          <p className="text-slate-400">Master coding challenges one by one</p>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search problems..."
              className="input-antigravity pl-10 w-full sm:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <select
              className="input-antigravity pl-10 pr-8 appearance-none cursor-pointer"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="All">All Levels</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div className="text-center py-20 glass-panel rounded-xl">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-slate-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-300 mb-2">No problems found</h3>
          <p className="text-slate-500">Try adjusting your filters or search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuestions.map(q => (
            <Link to={`/practice/questions/${q.id}`} key={q.id} className="group">
              <div className="glass-panel p-6 rounded-xl h-full border border-slate-700/50 group-hover:border-indigo-500/50 transition-all duration-300 group-hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150"></div>

                <div className="flex justify-between items-start mb-4 relative z-10">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${getDifficultyColor(q.complexity)}`}>
                    {q.complexity || 'Medium'}
                  </span>
                  {q.acceptance_rate > 0 && (
                    <span className="flex items-center gap-1 text-xs text-slate-400 bg-slate-800/50 px-2 py-1 rounded">
                      <BarChart className="w-3 h-3" /> {Math.round(q.acceptance_rate)}% Rate
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors line-clamp-1">{q.title}</h3>
                <p className="text-slate-400 text-sm mb-6 line-clamp-2 min-h-[40px]">
                  {q.description}
                </p>

                <div className="flex justify-between items-center mt-auto border-t border-slate-700/50 pt-4">
                  <span className="text-xs text-slate-500 font-mono">
                    {q.total_submissions || 0} submissions
                  </span>
                  <span className="text-indigo-400 text-sm font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Solve <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}