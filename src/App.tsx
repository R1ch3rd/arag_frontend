import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthProvider, { useAuth } from './context/AuthContext'
import { Layout } from './components/Layout/Layout';
import { Home } from './pages/Home';
import { Chat } from './pages/Chat';
import { Documents } from './pages/Documents';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ConfirmSignup from './pages/auth/ConfirmSignup';
import ForgotPassword from './pages/auth/ForgotPassword'; // ✨ NEW: Import ForgotPassword
import ResetPassword from './pages/auth/ResetPassword'; // ✨ NEW: Import ResetPassword
import GuestChat from './pages/GuestChat';

const LoadingScreen = () => (
  <div className="min-h-screen bg-cream flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 bg-accent-btn rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
        <span className="text-white font-mono text-xl font-semibold">aR</span>
      </div>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
      <p className="text-ink text-lg font-medium">Loading aRAG…</p>
      <p className="text-ink-muted text-sm">Setting up your workspace</p>
    </div>
  </div>
);

// ✨ ENHANCED: Better protected route with transitions
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
};

// ✨ ENHANCED: Auth route wrapper to redirect if already authenticated
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* ✨ ENHANCED: Auth routes with proper redirection */}
          <Route path="/auth/login" element={
            <AuthRoute>
              <Login />
            </AuthRoute>
          } />

          {/* ✨ Signup route */}
          <Route path="/auth/signup" element={
            <AuthRoute>
              <Signup />
            </AuthRoute>
          } />

          {/* ✨ NEW: Add confirmation route */}
          <Route path="/auth/confirm" element={
            <AuthRoute>
              <ConfirmSignup />
            </AuthRoute>
          } />

          {/* ✨ NEW: Add forgot password route */}
          <Route path="/auth/forgot-password" element={
            <AuthRoute>
              <ForgotPassword />
            </AuthRoute>
          } />

          {/* ✨ NEW: Add reset password route */}
          <Route path="/auth/reset-password" element={
            <AuthRoute>
              <ResetPassword />
            </AuthRoute>
          } />

          {/* ✨ Legacy login route redirect */}
          <Route path="/login" element={<Navigate to="/auth/login" replace />} />

          {/* Public guest demo: no auth, rate-limited server-side */}
          <Route path="/try" element={<GuestChat />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Home />} />
            <Route path="chat" element={<Chat />} />
            <Route path="documents" element={<Documents />} />
          </Route>

          {/* ✨ Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;