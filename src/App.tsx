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

// ✨ ENHANCED: Better loading component
const LoadingScreen = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 002 2z" />
        </svg>
      </div>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-4"></div>
      <p className="text-white text-lg font-medium">Loading ARAG...</p>
      <p className="text-slate-300 text-sm">Setting up your workspace</p>
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