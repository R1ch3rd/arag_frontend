// pages/auth/ForgotPassword.tsx
import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ForgotPassword = () => {
    const [email, setEmail] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);

    const { forgotPassword } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!email) {
            setError('Email is required');
            return;
        }

        if (!email.includes('@')) {
            setError('Please enter a valid email address');
            return;
        }

        setError('');
        setIsLoading(true);

        try {
            const result = await forgotPassword(email);

            if (result.success) {
                setIsSuccess(true);
                // Navigate to reset password page after 3 seconds
                setTimeout(() => {
                    navigate(`/auth/reset-password?email=${encodeURIComponent(email)}`);
                }, 3000);
            } else {
                setError(result.error || 'Failed to send reset email');
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    // Success state
    if (isSuccess) {
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
                        <div className="bg-surface py-8 px-4 shadow-sm sm:rounded-2xl sm:px-10 border border-surface-border">
                            <div className="text-center space-y-4">
                                <div className="w-16 h-16 bg-accent-dim rounded-full flex items-center justify-center mx-auto">
                                    <svg className="w-8 h-8 text-accent-deep" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-semibold text-white">Check Your Email</h3>
                                    <p className="text-ink-muted">
                                        We've sent a password reset code to <span className="font-medium text-accent-deep">{email}</span>
                                    </p>
                                    <p className="text-sm text-ink-faint">
                                        Please check your inbox and follow the instructions to reset your password.
                                    </p>
                                </div>
                                <div className="pt-4">
                                    <Link
                                        to={`/auth/reset-password?email=${encodeURIComponent(email)}`}
                                        className="inline-flex items-center px-4 py-2 bg-accent-btn text-white text-sm font-medium rounded-lg hover:bg-accent transition-all duration-200"
                                    >
                                        Continue to Reset Password
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

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
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <span className="text-3xl font-display font-semibold text-ink">aRAG</span>
                        </div>
                    </div>

                    <h2 className="text-center text-3xl font-bold tracking-tight text-ink mb-2">
                        Forgot your password?
                    </h2>
                    <p className="text-center text-sm text-ink-muted">
                        No worries! Enter your email and we'll send you a reset code.
                    </p>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-surface py-8 px-4 shadow-sm sm:rounded-2xl sm:px-10 border border-surface-border">
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
                                    placeholder="Enter your email address"
                                />
                            </div>

                            {/* Error display */}
                            {error && (
                                <div className="bg-blush-dim border border-blush-dim text-blush px-4 py-3 rounded-lg flex items-center space-x-2">
                                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-sm">{error}</span>
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
                                {isLoading ? 'Sending reset code...' : 'Send reset code'}
                            </button>

                            {/* Back to login link */}
                            <div className="text-center">
                                <Link
                                    to="/auth/login"
                                    className="text-sm text-ink-faint hover:text-ink transition-colors flex items-center justify-center space-x-1"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    <span>Back to sign in</span>
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;