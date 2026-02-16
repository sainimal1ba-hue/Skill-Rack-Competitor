import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/userStore.jsx';
import { Code2, Trophy, BookOpen, Target, Sparkles, ChevronRight, Zap } from 'lucide-react';

export default function HomePage() {
  const { user } = useUser();

  return (
    <div className="min-h-screen animate-fade-in relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-5xl text-center">
          <div className="flex justify-center mb-8">
            <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 shadow-[0_0_30px_rgba(99,102,241,0.3)] animate-float">
              <Code2 className="w-16 h-16 text-indigo-400" />
            </div>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold mb-8 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
              Master Coding
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
              Through Practice
            </span>
          </h1>

          <p className="text-xl md:text-2xl mb-12 text-slate-400 max-w-3xl mx-auto font-light leading-relaxed">
            Elevate your programming skills with our premium challenge platform.
            Compete, learn, and grow in an environment designed for excellence.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            {!user ? (
              <>
                <Link to="/register" className="btn-antigravity px-10 py-4 text-lg group">
                  <span className="flex items-center gap-2">
                    Get Started Free <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
                <Link to="/login" className="px-10 py-4 rounded-xl text-slate-300 hover:text-white border border-slate-700 hover:bg-slate-800/50 transition-all text-lg font-medium">
                  Sign In
                </Link>
              </>
            ) : (
              <Link to="/dashboard" className="btn-antigravity px-10 py-4 text-lg">
                Go to Dashboard
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<BookOpen className="w-8 h-8 text-indigo-400" />}
              title="Practice Problems"
              description="Access a curated library of coding challenges organized by topics and difficulty levels."
              color="indigo"
            />
            <FeatureCard
              icon={<Trophy className="w-8 h-8 text-fuchsia-400" />}
              title="Global Contests"
              description="Compete with developers worldwide in real-time ranked contests and climb the leaderboard."
              color="fuchsia"
            />
            <FeatureCard
              icon={<Target className="w-8 h-8 text-emerald-400" />}
              title="Skill Tracking"
              description="Monitor your progress with detailed analytics and visualization of your coding journey."
              color="emerald"
            />
          </div>
        </div>
      </section>

      {/* Stats/Languages Bar */}
      <section className="py-16 border-y border-slate-800/50 bg-slate-900/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-500 mb-8 uppercase tracking-widest text-sm font-bold">Supported Languages</p>
          <div className="flex flex-wrap justify-center gap-12 opacity-70 hover:opacity-100 transition-opacity">
            {['Python', 'JavaScript', 'C++', 'Java', 'C'].map(lang => (
              <span key={lang} className="text-2xl font-bold text-slate-300 font-mono flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-500/50" /> {lang}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-32 px-4 text-center relative">
        <div className="container mx-auto max-w-4xl">
          <Zap className="w-12 h-12 text-yellow-400 mx-auto mb-6 animate-pulse" />
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Level Up?</h2>
          <p className="text-xl text-slate-400 mb-10">
            Join thousands of developers pushing the boundaries of what's possible.
          </p>
          {!user && (
            <Link to="/register" className="inline-block glass-panel px-12 py-4 rounded-full text-white hover:bg-slate-700/50 transition-all border border-slate-600 hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]">
              Create Free Account
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description, color }) {
  const colorMap = {
    indigo: 'hover:border-indigo-500/50 hover:shadow-indigo-500/10',
    fuchsia: 'hover:border-fuchsia-500/50 hover:shadow-fuchsia-500/10',
    emerald: 'hover:border-emerald-500/50 hover:shadow-emerald-500/10',
  };

  return (
    <div className={`glass-panel p-8 rounded-2xl transition-all duration-300 border border-slate-700/50 ${colorMap[color]} hover:-translate-y-1 group`}>
      <div className={`w-16 h-16 rounded-xl bg-${color}-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-${color}-500/20`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
      <p className="text-slate-400 leading-relaxed font-light">{description}</p>
    </div>
  );
}
