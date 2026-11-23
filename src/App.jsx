import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Footer from './components/Footer';
import BackendStatusBar from './components/BackendStatusBar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import DiscoverPage from './pages/DiscoverPage';
import AddBookPage from './pages/AddBookPage';
import AvailableBooksPage from './pages/AvailableBooksPage';
import WantedBooksPage from './pages/WantedBooksPage';
import MatchesPage from './pages/MatchesPage';
import ProfilePage from './pages/ProfilePage';
import { useAuth } from './context/AuthContext';
import './styles/index.css';
import './styles/pages.css';
import './styles/swipe.css';

// Protected Route Component
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/welcome" replace />;
  }
  return children;
}

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="app-layout">
      {/* Backend Connectivity Status Bar */}
      <BackendStatusBar />

      {/* Main Top Navigation */}
      <Navbar />

      {/* App Body Content */}
      <main className="main-content">
        <Routes>
          {/* Public / Landing Route */}
          <Route path="/welcome" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Root: Dashboard if authenticated, else Landing Page */}
          <Route path="/" element={
            isAuthenticated ? <DashboardPage /> : <LandingPage />
          } />

          {/* Protected Application Routes */}
          <Route path="/discover" element={
            <ProtectedRoute>
              <DiscoverPage />
            </ProtectedRoute>
          } />

          <Route path="/add-book" element={
            <ProtectedRoute>
              <AddBookPage />
            </ProtectedRoute>
          } />

          <Route path="/available" element={
            <ProtectedRoute>
              <AvailableBooksPage />
            </ProtectedRoute>
          } />

          <Route path="/wanted" element={
            <ProtectedRoute>
              <WantedBooksPage />
            </ProtectedRoute>
          } />

          <Route path="/matches" element={
            <ProtectedRoute>
              <MatchesPage />
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Global Editorial Footer */}
      <Footer />
    </div>
  );
}
