// pages/auth/Signup.tsx - ENHANCED VERSION with capital letter requirement
import type { FormEvent } from 'react';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const Signup = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);

    const { signup } = useAuth();
    const navigate = useNavigate();

    // ✨ ENHANCED: Password validation with capital letter requirement
    const validateForm = () => {
        if (!email) {
            setError('Email is required');
            return false;
        }
        if (!email.includes('@')) {
            setError('Please enter a valid email address');
            return false;
        }
        if (!password) {
            setError('Password is required');
            return false;
        }
        if (password.length < 8) {
            setError('Password must be at least 8 characters long');
            return false;
        }
        if (!/[A-Z]/.test(password)) {
            setError('Password must contain at least one uppercase letter');
            return false;
        }
        if (!/[a-z]/.test(password)) {
            setError('Password must contain at least one lowercase letter');
            return false;
        }
        if (!/[0-9]/.test(password)) {
            setError('Password must contain at least one number');
            return false;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setError('');
        setIsLoading(true);

        try {
            const result = await signup(email, password, confirmPassword);

            if (result.success) {
                setIsSuccess(true);
                // Navigate to confirmation page after 2 seconds
                setTimeout(() => {
                    navigate(`/auth/confirm?email=${encodeURIComponent(email)}`);
                }, 2000);
            } else {
                // ✨ ENHANCED: Handle existing unconfirmed users
                if (result.existingUnconfirmed) {
                    setError(`${result.error || 'Account exists but unconfirmed.'} Redirecting to confirmation...`);
                    setTimeout(() => {
                        navigate(`/auth/confirm?email=${encodeURIComponent(email)}`);
                    }, 3000);
                } else {
                    setError(result.error || 'Signup failed');
                }
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
                                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                                    <svg className="w-8 h-8 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-semibold text-white">Welcome to ARAG!</h3>
                                    <p className="text-ink-muted">
                                        We've sent a confirmation email to <span className="font-medium text-accent-deep">{email}</span>
                                    </p>
                                    <p className="text-sm text-ink-faint">
                                        Please check your inbox and enter the confirmation code to activate your account.
                                    </p>
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
                        Create your account
                    </h2>
                    <p className="text-center text-sm text-ink-muted">
                        Join thousands of users already using ARAG
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
                                        placeholder="Create a password"
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

                            {/* Confirm Password */}
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-ink-muted mb-2">
                                    Confirm password
                                </label>
                                <div className="relative">
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full h-12 px-4 pr-12 bg-surface-warm border border-surface-border rounded-lg text-ink placeholder-ink-faint focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent  transition-all duration-200"
                                        placeholder="Confirm your password"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-ink-faint hover:text-ink"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* ✨ ENHANCED: Password requirements with capital letter */}
                            <div className="bg-surface-warm rounded-lg p-4 space-y-2">
                                <p className="text-sm font-medium text-ink-muted">Password requirements:</p>
                                <div className="space-y-1">
                                    <div className={`flex items-center space-x-2 text-xs ${password.length >= 8 ? 'text-sage' : 'text-ink-faint'}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${password.length >= 8 ? 'bg-sage' : 'bg-ink-faint'}`} />
                                        <span>At least 8 characters</span>
                                    </div>
                                    <div className={`flex items-center space-x-2 text-xs ${/[A-Z]/.test(password) ? 'text-sage' : 'text-ink-faint'}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(password) ? 'bg-sage' : 'bg-ink-faint'}`} />
                                        <span>One uppercase letter</span>
                                    </div>
                                    <div className={`flex items-center space-x-2 text-xs ${/[a-z]/.test(password) ? 'text-sage' : 'text-ink-faint'}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${/[a-z]/.test(password) ? 'bg-sage' : 'bg-ink-faint'}`} />
                                        <span>One lowercase letter</span>
                                    </div>
                                    <div className={`flex items-center space-x-2 text-xs ${/[0-9]/.test(password) ? 'text-sage' : 'text-ink-faint'}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${/[0-9]/.test(password) ? 'bg-sage' : 'bg-ink-faint'}`} />
                                        <span>One number</span>
                                    </div>
                                    <div className={`flex items-center space-x-2 text-xs ${password && confirmPassword && password === confirmPassword ? 'text-sage' : 'text-ink-faint'}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${password && confirmPassword && password === confirmPassword ? 'bg-sage' : 'bg-ink-faint'}`} />
                                        <span>Passwords match</span>
                                    </div>
                                </div>
                            </div>

                            {/* Error display */}
                            {error && (
                                <div className="bg-blush-dim border border-blush-dim text-blush px-4 py-3 rounded-lg flex items-start space-x-2">
                                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div className="text-sm">
                                        <p>{error}</p>
                                        {error.includes('Redirecting') && (
                                            <p className="mt-1 text-xs">Taking you to confirmation page...</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Terms checkbox */}
                            <div className="flex items-center">
                                <input
                                    id="terms"
                                    name="terms"
                                    type="checkbox"
                                    required
                                    className="h-4 w-4 text-accent-btn focus:ring-accent border-surface-border rounded bg-surface-warm"
                                />
                                <label htmlFor="terms" className="ml-2 block text-sm text-ink-muted">
                                    I agree to the Terms of Service and Privacy Policy
                                </label>
                            </div>

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
                                {isLoading ? 'Creating account...' : 'Create account'}
                            </button>

                            {/* Sign in link */}
                            <div className="text-center">
                                <span className="text-ink-muted">Already have an account? </span>
                                <Link
                                    to="/auth/login"
                                    className="font-medium text-accent-deep hover:text-accent transition-colors"
                                >
                                    Sign in
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;