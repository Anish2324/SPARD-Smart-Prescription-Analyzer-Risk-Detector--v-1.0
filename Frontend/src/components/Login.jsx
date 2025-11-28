import React, { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
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
        } catch (error) {
            toast.error('Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center px-4">
            <div className="max-w-lg w-full bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-10">
                <div className="text-center mb-10">
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold text-slate-800 mb-3">Welcome Back</h1>
                    <p className="text-slate-600 text-lg">Sign in to your secure dashboard</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-slate-900 placeholder-slate-400 shadow-sm"
                            placeholder="Enter your email address"
                            required
                        />
                    </div>

                    <div className="relative">
                        <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                            Password
                        </label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-3.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-slate-900 placeholder-slate-400 shadow-sm pr-12"
                            placeholder="Enter your password"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-11 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            {showPassword ? (
                                <EyeSlashIcon className="h-5 w-5" />
                            ) : (
                                <EyeIcon className="h-5 w-5" />
                            )}
                        </button>
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="flex items-center">
                            <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 bg-white" />
                            <span className="ml-2 text-sm text-slate-600">Remember me</span>
                        </label>
                        <button type="button" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                            Forgot password?
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                                Signing you in...
                            </div>
                        ) : (
                            <span className="flex items-center justify-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                </svg>
                                Sign In
                            </span>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <div className="flex items-center justify-center mb-4">
                        <div className="h-px bg-slate-200 flex-1"></div>
                        <span className="px-4 text-sm text-slate-500">New to our platform?</span>
                        <div className="h-px bg-slate-200 flex-1"></div>
                    </div>
                    <button
                        onClick={onSwitchToRegister}
                        className="text-indigo-600 hover:text-indigo-700 font-semibold text-lg transition-colors duration-200 underline underline-offset-4 decoration-2 hover:decoration-indigo-600"
                    >
                        Create your account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;