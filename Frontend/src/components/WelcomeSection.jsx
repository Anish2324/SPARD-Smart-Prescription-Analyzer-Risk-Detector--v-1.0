import React from 'react';
import { UserCircleIcon, ShieldCheckIcon, ClockIcon, HeartIcon } from '@heroicons/react/24/outline';
import { useStore } from '../store';

const WelcomeSection = () => {
    const { user } = useStore();

    if (!user) return null;

    return (
        <div className="bg-linear-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="bg-white p-3 rounded-full shadow-sm">
                        <UserCircleIcon className="h-8 w-8 text-indigo-600" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            Welcome back, {user.name}! 👋
                        </h2>
                        <p className="text-gray-600 mt-1">
                            Ready to check your prescriptions for safety?
                        </p>
                    </div>
                </div>
                
                <div className="hidden md:flex items-center gap-6">
                    {user.age && (
                        <div className="text-center">
                            <div className="text-lg font-semibold text-gray-700">{user.age}</div>
                            <div className="text-xs text-gray-500">Age</div>
                        </div>
                    )}
                    {user.allergies && user.allergies.length > 0 && (
                        <div className="text-center">
                            <div className="text-lg font-semibold text-red-600">{user.allergies.length}</div>
                            <div className="text-xs text-gray-500">Known Allergies</div>
                        </div>
                    )}
                </div>
            </div>
            
            {user.allergies && user.allergies.length > 0 && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                        <HeartIcon className="h-5 w-5 text-yellow-600" />
                        <span className="font-medium text-yellow-800">Your Known Allergies:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {user.allergies.map((allergy, index) => (
                            <span
                                key={index}
                                className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm font-medium"
                            >
                                {allergy}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default WelcomeSection;