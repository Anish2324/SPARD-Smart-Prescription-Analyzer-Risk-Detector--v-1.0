import React from 'react';
import { ShieldCheckIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useStore } from '../store';
import toast from 'react-hot-toast';

function Header() {
    const { user, logout } = useStore();

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
    };

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <ShieldCheckIcon className="h-10 w-10 text-indigo-600" />
                        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
                            Prescription SafetyNet
                        </h1>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <p className="text-gray-600 hidden lg:block">
                            Your AI-powered drug interaction checker.
                        </p>
                        
                        {user && (
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                                    <UserCircleIcon className="h-5 w-5 text-gray-600" />
                                    <span className="text-sm font-medium text-gray-700">
                                        {user.name}
                                    </span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50"
                                    title="Logout"
                                >
                                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                                    <span className="text-sm hidden md:block">Logout</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
