import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, BeakerIcon, ClockIcon } from '@heroicons/react/24/outline';
import AnalysisReport from '../components/AnalysisReport';
import { useStore } from '../store';

function AnalysisPage() {
    const { report, isLoading } = useStore();
    const navigate = useNavigate();

    const handleBackToHome = () => {
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50/30 via-white to-teal-50/30">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header Section */}
                {/* <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-teal-400 rounded-3xl shadow-lg mb-4">
                        <BeakerIcon className="h-10 w-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold bg-linear-to-r from-blue-700 to-teal-600 bg-clip-text text-transparent mb-3">
                        Prescription Analysis
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Comprehensive safety assessment of your medication combinations
                    </p>
                </div> */}

                {/* Back to Home Button */}
                <div className="mb-8">
                    <button
                        onClick={handleBackToHome}
                        className="group flex items-center gap-3 px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-white/80 rounded-2xl transition-all duration-300 backdrop-blur-sm border border-gray-200 hover:border-gray-300 hover:shadow-lg"
                    >
                        <ArrowLeftIcon className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300" />
                        <span className="font-medium">Back to Home</span>
                    </button>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="relative overflow-hidden">
                        {/* Background Elements */}
                        <div className="absolute inset-0 bg-linear-to-br from-blue-50/50 to-teal-50/30 rounded-3xl"></div>
                        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-100 rounded-full -translate-y-20 translate-x-20 opacity-40"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-100 rounded-full translate-y-16 -translate-x-16 opacity-40"></div>
                        
                        <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-blue-100/50 text-center">
                            {/* Animated Loading Icon */}
                            <div className="relative inline-flex items-center justify-center mb-6">
                                <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-20"></div>
                                <div className="relative bg-linear-to-br from-blue-500 to-teal-400 p-4 rounded-2xl shadow-lg">
                                    <BeakerIcon className="h-12 w-12 text-white" />
                                </div>
                            </div>
                            
                            {/* Loading Text */}
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                Analyzing Your Prescriptions
                            </h2>
                            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                                Our AI is carefully examining your medications for potential interactions and safety concerns
                            </p>

                            {/* Animated Progress */}
                            <div className="flex items-center justify-center gap-4 mb-8">
                                <div className="flex items-center gap-2 text-blue-600">
                                    <ClockIcon className="h-5 w-5" />
                                    <span className="text-sm font-medium">Processing...</span>
                                </div>
                            </div>

                            {/* Animated Dots */}
                            <div className="flex justify-center gap-2">
                                <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>

                            {/* Safety Message */}
                            <div className="mt-8 bg-blue-50/80 border border-blue-200 rounded-2xl p-4 max-w-md mx-auto">
                                <p className="text-blue-800 text-sm font-medium">
                                    🔒 Your data is being processed securely and confidentially
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Analysis Report */}
                {!isLoading && report && (
                    <div className="animate-fadeIn">
                        {/* <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-blue-100/50 mb-8">
                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl border border-green-200 mb-4">
                                    <BeakerIcon className="h-8 w-8 text-green-600" />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-800 mb-2">Analysis Complete</h2>
                                <p className="text-gray-600">Your prescription safety report is ready</p>
                            </div>
                        </div> */}
                        <AnalysisReport report={report} />
                    </div>
                )}

                {/* No Report State */}
                {!isLoading && !report && (
                    <div className="relative overflow-hidden">
                        {/* Background Elements */}
                        <div className="absolute inset-0 bg-linear-to-br from-amber-50/50 to-orange-50/30 rounded-3xl"></div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100 rounded-full -translate-y-16 translate-x-16 opacity-40"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-100 rounded-full translate-y-12 -translate-x-12 opacity-40"></div>
                        
                        <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-amber-100/50 text-center">
                            {/* Icon */}
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-100 rounded-2xl border border-amber-200 mb-6">
                                <BeakerIcon className="h-10 w-10 text-amber-600" />
                            </div>
                            
                            {/* Message */}
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                No Analysis Available
                            </h2>
                            <p className="text-gray-600 text-lg mb-6 max-w-md mx-auto">
                                It looks like you haven't analyzed any prescriptions yet. Start by uploading your prescription documents for a comprehensive safety check.
                            </p>
                            
                            {/* Benefits List */}
                            <div className="grid md:grid-cols-2 gap-4 mb-8 max-w-2xl mx-auto">
                                <div className="bg-blue-50/80 p-4 rounded-xl border border-blue-200">
                                    <div className="text-blue-600 font-semibold mb-2">Drug Interactions</div>
                                    <div className="text-blue-700 text-sm">Check for dangerous medication combinations</div>
                                </div>
                                <div className="bg-green-50/80 p-4 rounded-xl border border-green-200">
                                    <div className="text-green-600 font-semibold mb-2">Allergy Conflicts</div>
                                    <div className="text-green-700 text-sm">Identify medications that may cause allergic reactions</div>
                                </div>
                                <div className="bg-purple-50/80 p-4 rounded-xl border border-purple-200">
                                    <div className="text-purple-600 font-semibold mb-2">Safety Recommendations</div>
                                    <div className="text-purple-700 text-sm">Get personalized safety advice from our AI</div>
                                </div>
                                <div className="bg-teal-50/80 p-4 rounded-xl border border-teal-200">
                                    <div className="text-teal-600 font-semibold mb-2">Medical Insights</div>
                                    <div className="text-teal-700 text-sm">Understand potential risks and alternatives</div>
                                </div>
                            </div>

                            {/* Action Button */}
                            <button
                                onClick={handleBackToHome}
                                className="inline-flex items-center gap-3 px-8 py-4 bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                                <BeakerIcon className="h-5 w-5" />
                                Start New Analysis
                            </button>

                            {/* Security Note */}
                            <div className="mt-6 bg-gray-50/80 border border-gray-200 rounded-xl p-4 max-w-md mx-auto">
                                <p className="text-gray-600 text-sm">
                                    🔒 Your prescription data is processed securely and never stored permanently
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AnalysisPage;