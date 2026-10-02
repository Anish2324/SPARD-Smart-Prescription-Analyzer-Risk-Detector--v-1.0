import React, { useState } from 'react';
import { EyeIcon, EyeSlashIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useStore } from '../store';

const Login = ({ onLogin, onSwitchToRegister }) => {
    const { login } = useStore();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.email || !formData.password) {
            toast.error('Please fill in all fields');
            return;
        }

        setIsLoading(true);
        
        try {
            const result = await login(formData.email, formData.password);
            
            if (result.success) {
                toast.success('Login successful!');
                onLogin(result.user);
            } else {
                toast.error(result.error);
            }
        } catch {
            toast.error('Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50/80 via-white to-teal-50/60 flex items-center justify-center px-4 py-8">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-20"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-200 rounded-full translate-x-1/3 translate-y-1/3 opacity-20"></div>
                <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-indigo-100 rounded-full opacity-30"></div>
            </div>

            <div className="relative max-w-md w-full">
                {/* Main Card */}
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                    {/* Healthcare Header Banner */}
                    <div className="bg-linear-to-r from-blue-600 to-teal-500 p-6 text-center">
                        <div className="flex items-center justify-center gap-3 mb-3">
                            <div className="bg-white/20 p-2 rounded-2xl">
                                <ShieldCheckIcon className="h-8 w-8 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold text-white">SPARD</h1>
                        </div>
                        <p className="text-blue-100 text-sm font-medium">
                            Smart Prescription Analyzer & Risk Detector
                        </p>
                    </div>

                    <div className="p-8">
                        {/* Welcome Section */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-blue-500 to-teal-400 rounded-2xl shadow-lg mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
                            <p className="text-gray-600">Sign in to access your prescription safety dashboard</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Email Field */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2 items-center">
                                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                    </svg>
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400 shadow-sm"
                                    placeholder="Enter your email address"
                                    required
                                />
                            </div>

                            {/* Password Field */}
                            <div className="relative">
                                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2 items-center">
                                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    Password
                                </label>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400 shadow-sm pr-12"
                                    placeholder="Enter your password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-11 p-1 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
                                >
                                    {showPassword ? (
                                        <EyeSlashIcon className="h-5 w-5" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5" />
                                    )}
                                </button>
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center">
                                    <input 
                                        type="checkbox" 
                                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 bg-white transition duration-200" 
                                    />
                                    <span className="ml-2 text-sm text-gray-600 font-medium">Remember me</span>
                                </label>
                                <button 
                                    type="button" 
                                    className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                                >
                                    Forgot password?
                                </button>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-linear-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center gap-3">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                        Signing you in...
                                    </div>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                        </svg>
                                        Sign In to Dashboard
                                    </span>
                                )}
                            </button>
                        </form>

                        {/* Security Notice */}
                        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                                <ShieldCheckIcon className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-blue-800 font-medium text-sm">Secure Login</p>
                                    <p className="text-blue-600 text-xs mt-1">
                                        Your health data is protected with enterprise-grade security and encryption.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Registration Prompt */}
                        <div className="mt-8 text-center">
                            <div className="flex items-center justify-center mb-4">
                                <div className="h-px bg-gray-200 flex-1"></div>
                                <span className="px-4 text-sm text-gray-500 font-medium">New to SPARD?</span>
                                <div className="h-px bg-gray-200 flex-1"></div>
                            </div>
                            <button
                                onClick={onSwitchToRegister}
                                className="text-blue-600 hover:text-blue-700 font-semibold text-lg transition-colors duration-200 hover:underline underline-offset-4"
                            >
                                Create your secure account
                            </button>
                            <p className="text-gray-500 text-sm mt-2">
                                Get started with prescription safety analysis
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer Note */}
                <div className="text-center mt-6">
                    <p className="text-gray-400 text-sm">
                        🔒 HIPAA Compliant • End-to-End Encrypted • Your Data is Secure
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;