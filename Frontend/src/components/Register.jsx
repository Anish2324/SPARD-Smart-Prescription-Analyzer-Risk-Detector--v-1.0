import React, { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useStore } from '../store';

const Register = ({ onRegister, onSwitchToLogin }) => {
    const { register } = useStore();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        age: '',
        gender: 'prefer-not-to-say',
        allergies: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = () => {
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
            toast.error('Please fill in all required fields');
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return false;
        }

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters long');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast.error('Please enter a valid email address');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setIsLoading(true);
        
        try {
            const registrationData = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                age: parseInt(formData.age) || undefined,
                gender: formData.gender,
                allergies: formData.allergies.split(',').map(a => a.trim()).filter(a => a)
            };
            
            const result = await register(registrationData);
            
            if (result.success) {
                toast.success('Registration successful! Welcome aboard!');
                onRegister(result.user);
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error('Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center px-4 py-8">
            <div className="max-w-lg w-full bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-10">
                <div className="text-center mb-10">
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold text-slate-800 mb-3">Create Account</h1>
                    <p className="text-slate-600 text-lg">Join our secure prescription management platform</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
                            Full Name *
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            placeholder="Enter your full name"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                            Email Address *
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label htmlFor="age" className="block text-sm font-semibold text-slate-700 mb-2">
                                Age
                            </label>
                            <input
                                type="number"
                                id="age"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                min="1"
                                max="120"
                                className="w-full px-4 py-3.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-slate-900 placeholder-slate-400 shadow-sm"
                                placeholder="Your age"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="allergies" className="block text-sm font-semibold text-slate-700 mb-2">
                            Known Allergies
                        </label>
                        <input
                            type="text"
                            id="allergies"
                            name="allergies"
                            value={formData.allergies}
                            onChange={handleChange}
                            className="w-full px-4 py-3.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-slate-900 placeholder-slate-400 shadow-sm"
                            placeholder="e.g., penicillin, aspirin (comma-separated)"
                        />
                        <p className="text-xs text-slate-500 mt-2">Separate multiple allergies with commas</p>
                    </div>

                    <div>
                        <label htmlFor="gender" className="block text-sm font-semibold text-slate-700 mb-2">
                            Gender
                        </label>
                        <select
                            id="gender"
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="w-full px-4 py-3.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-slate-900 shadow-sm"
                        >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                            <option value="prefer-not-to-say">Prefer not to say</option>
                        </select>
                    </div>

                    <div className="relative">
                        <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                            Password *
                        </label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-3.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-slate-900 placeholder-slate-400 shadow-sm pr-12"
                            placeholder="Create a secure password"
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

                    <div className="relative">
                        <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700 mb-2">
                            Confirm Password *
                        </label>
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full px-4 py-3.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-slate-900 placeholder-slate-400 shadow-sm pr-12"
                            placeholder="Confirm your password"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-11 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            {showConfirmPassword ? (
                                <EyeSlashIcon className="h-5 w-5" />
                            ) : (
                                <EyeIcon className="h-5 w-5" />
                            )}
                        </button>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="terms"
                            className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 bg-white"
                            required
                        />
                        <label htmlFor="terms" className="ml-3 text-sm text-slate-600">
                            I agree to the{' '}
                            <button type="button" className="text-indigo-600 hover:text-indigo-700 font-medium underline underline-offset-2">
                                Terms of Service
                            </button>{' '}
                            and{' '}
                            <button type="button" className="text-indigo-600 hover:text-indigo-700 font-medium underline underline-offset-2">
                                Privacy Policy
                            </button>
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                                Creating your account...
                            </div>
                        ) : (
                            <span className="flex items-center justify-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                Create Account
                            </span>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <div className="flex items-center justify-center mb-4">
                        <div className="h-px bg-slate-200 flex-1"></div>
                        <span className="px-4 text-sm text-slate-500">Already have an account?</span>
                        <div className="h-px bg-slate-200 flex-1"></div>
                    </div>
                    <button
                        onClick={onSwitchToLogin}
                        className="text-indigo-600 hover:text-indigo-700 font-semibold text-lg transition-colors duration-200 underline underline-offset-4 decoration-2 hover:decoration-indigo-600"
                    >
                        Sign in to your account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Register;