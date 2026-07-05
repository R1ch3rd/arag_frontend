// pages/auth/Login.tsx - Updated with confirmation success message
import type { FormEvent } from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const Login = () => {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  const { login } = useAuth();
  const navigate = useNavigate();

  // Check for success messages from URL params
  useEffect(() => {
    const confirmed = searchParams.get('confirmed');
    const message = searchParams.get('message');

    if (confirmed === 'true') {
      setSuccessMessage('Account confirmed successfully! Please log in to continue.');
      // Clear the URL params
      window.history.replaceState({}, document.title, '/auth/login');
    } else if (message) {
      setSuccessMessage(decodeURIComponent(message));
      window.history.replaceState({}, document.title, '/auth/login');
    }
  }, [searchParams]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      const result = await login(email, password);

      if (result.success) {
        navigate('/');
      } else {
        // Check for specific error types
        if (result.error?.includes('UserNotConfirmedException') ||
          result.error?.includes('not confirmed')) {
          setError('Please confirm your email address to complete signup.');
          // Redirect to confirmation page after 3 seconds
          setTimeout(() => {
            navigate(`/auth/confirm?email=${encodeURIComponent(email)}`);
          }, 3000);
        } else {
          setError(result.error || 'Login failed');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-accent rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-butter-dim rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-blush-dim rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-accent-btn rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-3xl font-display font-semibold text-ink">aRAG</span>
            </div>
          </div>

          <h2 className="text-center text-3xl font-bold tracking-tight text-ink mb-2">
            Welcome back
          </h2>
          <p className="text-center text-sm text-ink-muted">
            Sign in to your account to continue
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-surface py-8 px-4 shadow-sm sm:rounded-2xl sm:px-10 border border-surface-border">
            {/* Success message */}
            {successMessage && (
              <div className="mb-6 bg-sage-dim border border-sage-dim text-sage px-4 py-3 rounded-lg flex items-center space-x-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm">{successMessage}</span>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-ink-muted mb-2">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 px-4 bg-surface-warm border border-surface-border rounded-lg text-ink placeholder-ink-faint focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent  transition-all duration-200"
                  placeholder="Enter your email"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-ink-muted mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-12 px-4 pr-12 bg-surface-warm border border-surface-border rounded-lg text-ink placeholder-ink-faint focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent  transition-all duration-200"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-ink-faint hover:text-ink"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Error display */}
              {error && (
                <div className="bg-blush-dim border border-blush-dim text-blush px-4 py-3 rounded-lg flex items-center space-x-2">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-sm">
                    <p>{error}</p>
                    {error.includes('confirm') && (
                      <p className="mt-1 text-xs">Redirecting to confirmation page...</p>
                    )}
                  </div>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-accent-btn hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                {isLoading && (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>

              {/* Forgot password and sign up links */}
              <div className="text-center space-y-2">
                <div>
                  <Link
                    to="/auth/forgot-password"
                    className="text-sm text-accent-deep hover:text-accent transition-colors"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <div>
                  <span className="text-ink-muted">Don't have an account? </span>
                  <Link
                    to="/auth/signup"
                    className="font-medium text-accent-deep hover:text-accent transition-colors"
                  >
                    Sign up
                  </Link>
                </div>
                <div className="pt-2 border-t border-surface-border">
                  <Link
                    to="/try"
                    className="text-sm font-medium text-accent-deep hover:text-accent transition-colors"
                  >
                    Or try the demo without an account →
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;