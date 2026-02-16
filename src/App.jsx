import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './context/userStore.jsx';
import { ContestProvider } from './context/contestStore.jsx';
import Navbar from './components/navigation/Navbar';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import DashboardPage from './pages/Dashboard/DashboardPage';

// Practice Pages
import BranchListPage from './pages/Practise/BranchListPage';
import ChapterListPage from './pages/Practise/ChapterListPage';
import QuestionListPage from './pages/Practise/QuestionListPage';
import QuestionSolvePage from './pages/Practise/QuestionSolvePage';
import SubmissionHistoryPage from './pages/Practise/SubmissionHistoryPage';

// Contest Pages
import ContestListPage from './pages/Contest/ContestListPage';
import ContestLobbyPage from './pages/Contest/ContestLobbyPage';
import ContestPage from './pages/Contest/ContestPage';
import ContestResultsPage from './pages/Contest/ContestResultsPage';

// Admin Pages
import AdminBranches from './pages/Admin/AdminBranches';
import AdminChapters from './pages/Admin/AdminChapters';
import AdminQuestions from './pages/Admin/AdminQuestions';
import AdminContests from './pages/Admin/AdminContests';
import AdminUsers from './pages/Admin/AdminUsers';

// Protected Route Component
function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !user.admin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

// Public Route Component (redirect if logged in)
function PublicRoute({ children }) {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

// Main Layout Component
function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <ContestProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <RegisterPage />
                </PublicRoute>
              }
            />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <DashboardPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* Practice Routes */}
            <Route
              path="/practice"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <BranchListPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/practice/branches/:branchId"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <ChapterListPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/practice/chapters/:chapterId"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <QuestionListPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/practice/questions/:questionId"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <QuestionSolvePage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/submissions"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <SubmissionHistoryPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* Contest Routes */}
            <Route
              path="/contests"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <ContestListPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/contest/lobby/:contestId"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <ContestLobbyPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/contest/:contestId"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <ContestPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/contest/:contestId/results"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <ContestResultsPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/branches"
              element={
                <ProtectedRoute adminOnly>
                  <MainLayout>
                    <AdminBranches />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/chapters"
              element={
                <ProtectedRoute adminOnly>
                  <MainLayout>
                    <AdminChapters />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/questions"
              element={
                <ProtectedRoute adminOnly>
                  <MainLayout>
                    <AdminQuestions />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/contests"
              element={
                <ProtectedRoute adminOnly>
                  <MainLayout>
                    <AdminContests />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute adminOnly>
                  <MainLayout>
                    <AdminUsers />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* 404 Route */}
            <Route
              path="*"
              element={
                <MainLayout>
                  <div className="container mx-auto py-20 text-center">
                    <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
                    <p className="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
                    <a href="/" className="btn btn-primary">
                      Go Home
                    </a>
                  </div>
                </MainLayout>
              }
            />
          </Routes>
        </ContestProvider>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
