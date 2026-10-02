import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheckIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useStore } from '../store';
import toast from 'react-hot-toast';

function Header() {
    const { user, logout } = useStore();
    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
    };

    const handleLogoClick = () => {
        navigate('/');
    };

    return (
        <header className="bg-white shadow-lg border-b border-blue-50 sticky top-0 z-50">
            <div className="container mx-auto px-6 py-3">
                <div className="flex items-center justify-between">
                    {/* Logo Section */}
                    <div 
                        className="flex items-center gap-3 cursor-pointer group"
                        onClick={handleLogoClick}
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-blue-100 rounded-xl transform group-hover:scale-110 transition-transform duration-200"></div>
                            <ShieldCheckIcon className="h-12 w-12 text-blue-600 relative z-10 transform group-hover:scale-105 transition-transform duration-200" />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-2xl font-bold bg-linear-to-r from-blue-700 to-teal-600 bg-clip-text text-transparent">
                                SPARD
                            </h1>
                            <p className="text-xs text-gray-500 font-medium tracking-wide">
                                Smart Prescription Analyzer & Risk Detector
                            </p>
                        </div>
                    </div>
                    
                    {/* Right Section */}
                    <div className="flex items-center gap-6">
                        <div className="hidden xl:block">
                            <div className="bg-linear-to-r from-blue-50 to-teal-50 px-4 py-2 rounded-full border border-blue-100">
                                <p className="text-sm font-medium text-blue-700 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                    AI-Powered Drug Interaction Analysis
                                </p>
                            </div>
                        </div>
                        
                        {user && (
                            <div className="flex items-center gap-3">
                                {/* User Info */}
                                <div className="flex items-center gap-3 bg-linear-to-r from-blue-50 to-indigo-50 px-4 py-2 rounded-xl border border-blue-100 shadow-sm">
                                    <div className="flex items-center justify-center w-8 h-8 bg-white rounded-full border border-blue-200">
                                        <UserCircleIcon className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-gray-800">
                                            {user.name}
                                        </span>
                                       
                                    </div>
                                </div>
                                
                                {/* Logout Button */}
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-all duration-200 p-3 rounded-xl hover:bg-red-50 border border-transparent hover:border-red-100 group"
                                    title="Logout"
                                >
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-red-100 rounded-lg transform group-hover:scale-110 transition-transform duration-200 opacity-0 group-hover:opacity-100"></div>
                                        <ArrowRightOnRectangleIcon className="h-5 w-5 relative z-10" />
                                    </div>
                                    <span className="text-sm font-medium hidden md:block">Logout</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                
               
            </div>
            
            {/* Healthcare Status Bar */}
            <div className="bg-linear-to-r from-blue-600 to-teal-500 py-1">
                <div className="container mx-auto px-6">
                    <div className="flex items-center justify-center">
                        <p className="text-xs text-white font-medium flex items-center gap-2">
                            <ShieldCheckIcon className="h-3 w-3" />
                            Secure HIPAA Compliant • Real-time Drug Interaction Analysis • Trusted by Healthcare Professionals
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;