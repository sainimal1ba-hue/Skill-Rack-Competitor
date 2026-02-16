import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/userStore.jsx';
import { Code2, LogOut, User, Trophy, BookOpen, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass-panel sticky top-0 z-50 border-b border-slate-700/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-lg bg-indigo-500/20 group-hover:bg-indigo-500/30 transition-colors">
              <Code2 className="w-6 h-6 text-indigo-400" />
            </div>
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
              AntigravityCode
            </span>
          </Link>

          {/* Navigation Links */}
          {user && (
            <div className="flex items-center gap-6">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors group"
              >
                <LayoutDashboard className="w-5 h-5 group-hover:text-indigo-400 transition-colors" />
                <span className="font-medium text-sm">Dashboard</span>
              </Link>
              <Link
                to="/practice"
                className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors group"
              >
                <BookOpen className="w-5 h-5 group-hover:text-indigo-400 transition-colors" />
                <span className="font-medium text-sm">Practice</span>
              </Link>
              <Link
                to="/contests"
                className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors group"
              >
                <Trophy className="w-5 h-5 group-hover:text-indigo-400 transition-colors" />
                <span className="font-medium text-sm">Contests</span>
              </Link>

              {/* User Menu */}
              <div className="flex items-center gap-4 ml-4 pl-4 border-l border-slate-700">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center border border-slate-600">
                    <User className="w-4 h-4 text-slate-300" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white leading-none">{user.name}</span>
                    {user.admin && (
                      <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider mt-0.5">
                        Admin
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-red-500/10"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Auth Links */}
          {!user && (
            <div className="flex items-center gap-4">
              <Link to="/login" className="px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-all text-sm font-medium">
                Login
              </Link>
              <Link to="/register" className="btn-antigravity text-sm py-2 px-4 shadow-lg hover:shadow-indigo-500/25">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

