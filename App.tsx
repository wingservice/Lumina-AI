
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Generator from './pages/Generator';
import History from './pages/History';
import Credits from './pages/Credits';
import Admin from './pages/Admin';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import { User } from './types';
import { mockBackend } from './services/apiService';
import { auth } from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      // Only consider the user logged in if they have verified their email
      if (fbUser && fbUser.emailVerified) {
        // Find existing user metadata in local storage
        const usersJson = localStorage.getItem('lumina_users');
        const users = usersJson ? JSON.parse(usersJson) : {};
        const storedUser = users[fbUser.email!];
        
        if (storedUser) {
          setUser(storedUser);
        } else {
          // Fallback if metadata is missing
          setUser({
            id: fbUser.uid,
            email: fbUser.email || '',
            name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Explorer',
            credits: 5,
            isAdmin: fbUser.email === 'admin@lumina.ai'
          });
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAuthSuccess = (authUser: User) => {
    setUser(authUser);
  };

  const handleLogout = async () => {
    await mockBackend.logout();
    setUser(null);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser({ ...updatedUser });
    // Update local storage to keep consistency
    const usersJson = localStorage.getItem('lumina_users');
    const users = usersJson ? JSON.parse(usersJson) : {};
    users[updatedUser.email] = updatedUser;
    localStorage.setItem('lumina_users', JSON.stringify(users));
  };

  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-zinc-950 flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
        <p className="text-zinc-500 font-medium tracking-widest text-xs uppercase animate-pulse">Initializing Studio...</p>
      </div>
    );
  }

  return (
    <Router>
      {!user ? (
        <Routes>
          <Route path="/login" element={<Login onLoginSuccess={handleAuthSuccess} />} />
          <Route path="/signup" element={<Signup onSignupSuccess={handleAuthSuccess} />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      ) : (
        <div className="flex min-h-screen bg-zinc-950 text-zinc-50 overflow-x-hidden">
          <Sidebar user={user} />
          <main className="flex-1 flex flex-col min-w-0">
            <Header user={user} onLogout={handleLogout} />
            <div className="flex-1">
              <Routes>
                <Route path="/dashboard" element={<Dashboard user={user} />} />
                <Route path="/studio" element={<Generator user={user} onUpdateUser={handleUpdateUser} />} />
                <Route path="/history" element={<History user={user} />} />
                <Route path="/credits" element={<Credits onUpdateUser={handleUpdateUser} />} />
                <Route path="/admin" element={user?.isAdmin ? <Admin /> : <Navigate to="/dashboard" replace />} />
                <Route path="/settings" element={
                  <div className="p-12 text-center text-zinc-500">
                    <h2 className="text-2xl font-bold text-zinc-100 mb-2">Account Settings</h2>
                    <p>Settings module coming soon. Stay tuned for advanced profile controls.</p>
                  </div>
                } />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </div>
          </main>
        </div>
      )}
    </Router>
  );
};

export default App;
