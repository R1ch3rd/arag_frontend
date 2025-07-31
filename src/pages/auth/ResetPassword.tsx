// pages/auth/ResetPassword.tsx
import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const [email, setEmail] = useState(searchParams.get('email') || '');
    const [confirmationCode, setConfirmationCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const { resetPassword } = useAuth();
    const navigate = useNavigate();

    const validateForm = () => {
        if (!email) {
            setError('Email is required');
            return false;
        }
        if (!confirmationCode) {
            setError('Confirmation code is required');
            return false;
        }
        if (!newPassword) {
            setError('New password is required');
            return false;
        }
        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters long');
            return false;
        }
        if (!/[A-Z]/.test(newPassword)) {
            setError('Password must contain at least one uppercase letter');
            return false;
        }
        if (!/[a-z]/.test(newPassword)) {
            setError('Password must contain at least one lowercase letter');
            return false;
        }
        if (!/[0-9]/.test(newPassword)) {
            setError('Password must contain at least one number');
            return false;
        }
        if (newPassword !== confirmPassword) {
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
            const result = await resetPassword(email, confirmationCode, newPassword);

            if (result.success) {
                setIsSuccess(true);
                // Navigate to login after 3 seconds
                setTimeout(() => {
                    navigate('/auth/login?message=' + encodeURIComponent('Password reset successful! Please sign in with your new password.'));
                }, 3000);
            } else {
                setError(result.error || 'Failed to reset password');
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
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
                {/* Animated background */}
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob"></div>
                    <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-2000"></div>
                    <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-4000"></div>
                </div>

                <div className="relative flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8">
                    <div className="sm:mx-auto sm:w-full sm:max-w-md">
                        <div className="bg-white/10 backdrop-blur-xl py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-white/20">
                            <div className="text-center space-y-4">
                                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto animate-pulse">
                                    <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-2xl font-bold text-white">Password Reset Successful!</h3>
                                    <p className="text-slate-300">
                                        🎉 Your password has been successfully updated.
                                    </p>
                                    <p className="text-sm text-slate-400">
                                        You can now sign in with your new password.
                                    </p>
                                </div>
                                <div className="pt-6">
                                    <Link
                                        to="/auth/login"
                                        className="inline-flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                    >
                                        Continue to Sign In
                                        <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
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
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob"></div>
                <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    {/* Logo */}
                    <div className="flex justify-center mb-8">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center shadow-lg">
                                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <span className="text-3xl font-bold text-white">ARAG</span>
                        </div>
                    </div>

                    <h2 className="text-center text-3xl font-bold tracking-tight text-white mb-2">
                        Reset your password
                    </h2>
                    <p className="text-center text-sm text-slate-300">
                        Enter the code from your email and create a new password
                    </p>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white/10 backdrop-blur-xl py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-white/20">
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-200 mb-2">
                                    Email address
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full h-12 px-4 bg-white/5 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                                    placeholder="Enter your email"
                                />
                            </div>

                            {/* Confirmation Code */}
                            <div>
                                <label htmlFor="confirmationCode" className="block text-sm font-medium text-slate-200 mb-2">
                                    Reset code
                                </label>
                                <input
                                    id="confirmationCode"
                                    name="confirmationCode"
                                    type="text"
                                    required
                                    value={confirmationCode}
                                    onChange={(e) => setConfirmationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    className="w-full h-12 px-4 bg-white/5 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all duration-200 text-center text-lg tracking-widest"
                                    placeholder="000000"
                                    maxLength={6}
                                />
                                <p className="text-xs text-slate-400 mt-1">
                                    Enter the 6-digit code sent to your email
                                </p>
                            </div>

                            {/* New Password */}
                            <div>
                                <label htmlFor="newPassword" className="block text-sm font-medium text-slate-200 mb-2">
                                    New password
                                </label>
                                <div className="relative">
                                    <input
                                        id="newPassword"
                                        name="newPassword"
                                        type={showNewPassword ? 'text' : 'password'}
                                        required
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full h-12 px-4 pr-12 bg-white/5 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                                        placeholder="Enter new password"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-300"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                    >
                                        {showNewPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm New Password */}
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-200 mb-2">
                                    Confirm new password
                                </label>
                                <div className="relative">
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full h-12 px-4 pr-12 bg-white/5 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                                        placeholder="Confirm new password"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-300"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Password requirements */}
                            <div className="bg-white/5 rounded-lg p-4 space-y-2">
                                <p className="text-sm font-medium text-slate-300">Password requirements:</p>
                                <div className="space-y-1">
                                    <div className={`flex items-center space-x-2 text-xs ${newPassword.length >= 8 ? 'text-green-400' : 'text-slate-400'}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${newPassword.length >= 8 ? 'bg-green-400' : 'bg-slate-400'}`} />
                                        <span>At least 8 characters</span>
                                    </div>
                                    <div className={`flex items-center space-x-2 text-xs ${/[A-Z]/.test(newPassword) ? 'text-green-400' : 'text-slate-400'}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(newPassword) ? 'bg-green-400' : 'bg-slate-400'}`} />
                                        <span>One uppercase letter</span>
                                    </div>
                                    <div className={`flex items-center space-x-2 text-xs ${/[a-z]/.test(newPassword) ? 'text-green-400' : 'text-slate-400'}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${/[a-z]/.test(newPassword) ? 'bg-green-400' : 'bg-slate-400'}`} />
                                        <span>One lowercase letter</span>
                                    </div>
                                    <div className={`flex items-center space-x-2 text-xs ${/[0-9]/.test(newPassword) ? 'text-green-400' : 'text-slate-400'}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${/[0-9]/.test(newPassword) ? 'bg-green-400' : 'bg-slate-400'}`} />
                                        <span>One number</span>
                                    </div>
                                    <div className={`flex items-center space-x-2 text-xs ${newPassword && confirmPassword && newPassword === confirmPassword ? 'text-green-400' : 'text-slate-400'}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${newPassword && confirmPassword && newPassword === confirmPassword ? 'bg-green-400' : 'bg-slate-400'}`} />
                                        <span>Passwords match</span>
                                    </div>
                                </div>
                            </div>

                            {/* Error display */}
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg flex items-center space-x-2">
                                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-sm">{error}</span>
                                </div>
                            )}

                            {/* Submit button */}
                            <button
                                type="submit"
                                disabled={isLoading || confirmationCode.length !== 6}
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                            >
                                {isLoading && (
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                )}
                                {isLoading ? 'Resetting password...' : 'Reset password'}
                            </button>

                            {/* Back to login link */}
                            <div className="text-center">
                                <Link
                                    to="/auth/login"
                                    className="text-sm text-slate-400 hover:text-slate-300 transition-colors flex items-center justify-center space-x-1"
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

export default ResetPassword;