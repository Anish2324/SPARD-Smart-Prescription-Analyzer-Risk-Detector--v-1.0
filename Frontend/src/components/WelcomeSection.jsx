import React, { useEffect } from 'react';
import { UserCircleIcon, ShieldCheckIcon, ClockIcon, HeartIcon } from '@heroicons/react/24/outline';
import { useStore } from '../store';

const WelcomeSection = () => {
    const { user } = useStore();

    // Determine if this is a new user (just registered)
    const isNewUser = () => {
        // Check if user just registered by looking at session storage flag
        const justRegistered = sessionStorage.getItem('userJustRegistered');
        if (justRegistered === 'true') {
            return true;
        }
        
        // Fallback: check if created_at and last_login are very close (within 2 minutes)
        if (user.created_at && user.last_login) {
            const createdAt = new Date(user.created_at);
            const lastLogin = new Date(user.last_login);
            const timeDiff = Math.abs(lastLogin.getTime() - createdAt.getTime());
            const minutesDiff = timeDiff / (1000 * 60);
            
            return minutesDiff < 2;
        }
        
        return false;
    };

    const newUser = user ? isNewUser() : false;

    // Clear the "just registered" flag after showing the welcome message
    useEffect(() => {
        if (newUser) {
            const timer = setTimeout(() => {
                sessionStorage.removeItem('userJustRegistered');
            }, 30000); // Clear after 30 seconds
            
            return () => clearTimeout(timer);
        }
    }, [newUser]);

    if (!user) return null;

    return (
        <div className="relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 bg-linear-to-br from-blue-50 via-white to-teal-50"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full -translate-y-16 translate-x-16 opacity-60"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-teal-100 rounded-full translate-y-12 -translate-x-12 opacity-60"></div>
            
            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 mb-8 shadow-lg border border-blue-100/50">
                {/* Main Welcome Content */}
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                    <div className="flex items-start gap-4 flex-1">
                        {/* User Avatar with patient-friendly styling */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-linear-to-br from-blue-400 to-teal-300 rounded-full transform rotate-6 scale-105 opacity-20"></div>
                            <div className="relative bg-white p-3 rounded-full shadow-lg border border-blue-100">
                                <UserCircleIcon className="h-12 w-12 text-blue-500" />
                            </div>
                            {newUser && (
                                <div className="absolute -top-1 -right-1">
                                    <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                                        NEW
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        {/* Welcome Text */}
                        <div className="flex-1">
                            <h2 className="text-2xl lg:text-3xl font-bold bg-linear-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                                {newUser ? (
                                    <>Welcome, {user.name}! 🎉</>
                                ) : (
                                    <>Welcome back, {user.name}! 👋</>
                                )}
                            </h2>
                            <p className="text-gray-600 mt-2 text-lg">
                                {newUser ? (
                                    "Let's get started with your prescription safety check!"
                                ) : (
                                    "Ready to check your prescriptions for safety?"
                                )}
                            </p>
                            
                            {/* Patient Quick Stats */}
                            <div className="flex items-center gap-6 mt-4">
                                {user.age && (
                                    <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full">
                                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                        <span className="text-sm font-medium text-gray-700">
                                            Age: <span className="text-blue-600 font-semibold">{user.age}</span>
                                        </span>
                                    </div>
                                )}
                                {user.allergies && user.allergies.length > 0 && (
                                    <div className="flex items-center gap-2 bg-amber-50 px-3 py-1 rounded-full">
                                        <HeartIcon className="h-4 w-4 text-amber-500" />
                                        <span className="text-sm font-medium text-gray-700">
                                            Allergies: <span className="text-amber-600 font-semibold">{user.allergies.length}</span>
                                        </span>
                                    </div>
                                )}
                                {user.medical_conditions && user.medical_conditions.length > 0 && (
                                    <div className="flex items-center gap-2 bg-purple-50 px-3 py-1 rounded-full">
                                        <ShieldCheckIcon className="h-4 w-4 text-purple-500" />
                                        <span className="text-sm font-medium text-gray-700">
                                            Conditions: <span className="text-purple-600 font-semibold">{user.medical_conditions.length}</span>
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {/* Patient Health Summary */}
                    <div className="flex items-center gap-6 bg-gray-50/80 rounded-2xl px-6 py-4 border border-gray-100">
                        {user.age && (
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">{user.age}</div>
                                <div className="text-xs text-gray-500 font-medium">Years Old</div>
                            </div>
                        )}
                        {user.allergies && user.allergies.length > 0 && (
                            <div className="text-center">
                                <div className="text-2xl font-bold text-amber-600">{user.allergies.length}</div>
                                <div className="text-xs text-gray-500 font-medium">Allergies</div>
                            </div>
                        )}
                        {user.medical_conditions && (
                            <div className="text-center">
                                <div className="text-2xl font-bold text-purple-600">{user.medical_conditions.length || 0}</div>
                                <div className="text-xs text-gray-500 font-medium">Conditions</div>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Allergies Alert Section */}
                {user.allergies && user.allergies.length > 0 && (
                    <div className="mt-6 p-5 bg-amber-50/80 border border-amber-200 rounded-2xl backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="bg-amber-100 p-2 rounded-full">
                                <HeartIcon className="h-5 w-5 text-amber-600" />
                            </div>
                            <div>
                                <span className="font-semibold text-amber-800">Your Known Allergies</span>
                                <p className="text-sm text-amber-600 mt-1">
                                    We'll automatically check for these in your medications
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {user.allergies.map((allergy, index) => (
                                <span
                                    key={index}
                                    className="bg-amber-100 text-amber-800 px-3 py-2 rounded-full text-sm font-medium border border-amber-200 shadow-sm"
                                >
                                    {allergy}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Medical Conditions Section */}
                {user.medical_conditions && user.medical_conditions.length > 0 && (
                    <div className="mt-4 p-5 bg-purple-50/80 border border-purple-200 rounded-2xl backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="bg-purple-100 p-2 rounded-full">
                                <ShieldCheckIcon className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <span className="font-semibold text-purple-800">Your Medical Conditions</span>
                                <p className="text-sm text-purple-600 mt-1">
                                    These help us provide better medication safety analysis
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {user.medical_conditions.map((condition, index) => (
                                <span
                                    key={index}
                                    className="bg-purple-100 text-purple-800 px-3 py-2 rounded-full text-sm font-medium border border-purple-200 shadow-sm"
                                >
                                    {condition}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* First-time patient guidance */}
                {newUser && (
                    <div className="mt-6 p-6 bg-linear-to-r from-blue-50 to-teal-50 border border-blue-200 rounded-2xl">
                        <div className="flex items-start gap-4">
                            <div className="bg-blue-100 p-3 rounded-2xl">
                                <ShieldCheckIcon className="h-8 w-8 text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-blue-900 text-lg mb-3">Getting Started with Your Medication Safety</h4>
                                <div className="grid md:grid-cols-2 gap-4 text-blue-800">
                                    <div className="flex items-start gap-2">
                                        <div className="bg-blue-200 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">
                                            1
                                        </div>
                                        <div>
                                            <span className="font-semibold">Upload Prescriptions</span>
                                            <p className="text-sm text-blue-700">Take photos of your medication lists or prescriptions</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <div className="bg-blue-200 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">
                                            2
                                        </div>
                                        <div>
                                            <span className="font-semibold">AI Safety Analysis</span>
                                            <p className="text-sm text-blue-700">Our system checks for drug interactions and allergies</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <div className="bg-blue-200 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">
                                            3
                                        </div>
                                        <div>
                                            <span className="font-semibold">Personalized Reports</span>
                                            <p className="text-sm text-blue-700">Get easy-to-understand safety recommendations</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <div className="bg-blue-200 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">
                                            4
                                        </div>
                                        <div>
                                            <span className="font-semibold">Share with Doctor</span>
                                            <p className="text-sm text-blue-700">Discuss findings with your healthcare provider</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WelcomeSection;