import React, { useState } from 'react';
import { EyeIcon, EyeSlashIcon, ShieldCheckIcon, UserPlusIcon } from '@heroicons/react/24/outline';
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
                toast.success('Registration successful! Welcome to SPARD!');
                onRegister(result.user);
            } else {
                toast.error(result.error);
            }
        } catch {
            toast.error('Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50/80 via-white to-teal-50/60 flex items-center justify-center px-4 py-8">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 right-0 w-72 h-72 bg-blue-200 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-20"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-200 rounded-full translate-x-1/3 translate-y-1/3 opacity-20"></div>
                <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-indigo-100 rounded-full opacity-30"></div>
            </div>

            <div className="relative max-w-2xl w-full">
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
                                <UserPlusIcon className="h-8 w-8 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Your Account</h2>
                            <p className="text-gray-600">Join our secure prescription safety platform</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Personal Information Section */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Full Name */}
                                <div>
                                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2 items-center">
                                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400 shadow-sm"
                                        placeholder="Enter your full name"
                                        required
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2 items-center">
                                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                        </svg>
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400 shadow-sm"
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Health Information Section */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Age */}
                                <div>
                                    <label htmlFor="age" className="block text-sm font-semibold text-gray-700 mb-2 items-center">
                                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
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
                                        className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400 shadow-sm"
                                        placeholder="Your age"
                                    />
                                </div>

                                {/* Gender */}
                                <div>
                                    <label htmlFor="gender" className="block text-sm font-semibold text-gray-700 mb-2 items-center">
                                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Gender
                                    </label>
                                    <select
                                        id="gender"
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 shadow-sm"
                                    >
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                        <option value="prefer-not-to-say">Prefer not to say</option>
                                    </select>
                                </div>
                            </div>

                            {/* Allergies */}
                            <div>
                                <label htmlFor="allergies" className="block text-sm font-semibold text-gray-700 mb-2 items-center">
                                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                    Known Allergies
                                </label>
                                <input
                                    type="text"
                                    id="allergies"
                                    name="allergies"
                                    value={formData.allergies}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400 shadow-sm"
                                    placeholder="e.g., penicillin, aspirin, nsaids (comma-separated)"
                                />
                                <p className="text-xs text-gray-500 mt-2 flex items-center">
                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Separate multiple allergies with commas. This helps us provide better safety analysis.
                                </p>
                            </div>

                            {/* Password Section */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Password */}
                                <div className="relative">
                                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2 items-center">
                                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                        Password *
                                    </label>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400 shadow-sm pr-12"
                                        placeholder="Create a secure password"
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

                                {/* Confirm Password */}
                                <div className="relative">
                                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2 items-center">
                                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                        Confirm Password *
                                    </label>
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400 shadow-sm pr-12"
                                        placeholder="Confirm your password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-11 p-1 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeSlashIcon className="h-5 w-5" />
                                        ) : (
                                            <EyeIcon className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Terms Agreement */}
                            <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 bg-white mt-1 transition duration-200"
                                    required
                                />
                                <label htmlFor="terms" className="text-sm text-gray-700">
                                    I agree to the{' '}
                                    <button type="button" className="text-blue-600 hover:text-blue-700 font-medium underline underline-offset-2 transition-colors">
                                        Terms of Service
                                    </button>{' '}
                                    and{' '}
                                    <button type="button" className="text-blue-600 hover:text-blue-700 font-medium underline underline-offset-2 transition-colors">
                                        Privacy Policy
                                    </button>
                                    . I understand that my health information will be processed securely and used only for prescription safety analysis purposes.
                                </label>
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
                                        Creating your account...
                                    </div>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        <UserPlusIcon className="h-5 w-5" />
                                        Create Secure Account
                                    </span>
                                )}
                            </button>
                        </form>

                        {/* Security Notice */}
                        <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                                <ShieldCheckIcon className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-green-800 font-medium text-sm">Your Data is Protected</p>
                                    <p className="text-green-600 text-xs mt-1">
                                        All health information is encrypted and processed according to healthcare privacy standards.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Login Prompt */}
                        <div className="mt-8 text-center">
                            <div className="flex items-center justify-center mb-4">
                                <div className="h-px bg-gray-200 flex-1"></div>
                                <span className="px-4 text-sm text-gray-500 font-medium">Already have an account?</span>
                                <div className="h-px bg-gray-200 flex-1"></div>
                            </div>
                            <button
                                onClick={onSwitchToLogin}
                                className="text-blue-600 hover:text-blue-700 font-semibold text-lg transition-colors duration-200 hover:underline underline-offset-4"
                            >
                                Sign in to your account
                            </button>
                            <p className="text-gray-500 text-sm mt-2">
                                Access your prescription safety dashboard
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer Note */}
                <div className="text-center mt-6">
                    <p className="text-gray-400 text-sm">
                        🔒 HIPAA Compliant • End-to-End Encrypted • Your Health Data is Secure
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;