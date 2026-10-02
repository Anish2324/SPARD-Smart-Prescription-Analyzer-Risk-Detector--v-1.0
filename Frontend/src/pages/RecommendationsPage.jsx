import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, LightBulbIcon, CheckCircleIcon, ExclamationTriangleIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { useStore } from '../store';

function RecommendationsPage() {
    const { report } = useStore();
    const navigate = useNavigate();

    const handleBackToAnalysis = () => {
        navigate('/analysis');
    };

    if (!report) {
        return (
            <div className="min-h-screen bg-linear-to-br from-blue-50/30 via-white to-teal-50/30">
                <div className="max-w-4xl mx-auto px-4 py-16">
                    <div className="relative overflow-hidden">
                        {/* Background Elements */}
                        <div className="absolute inset-0 bg-linear-to-br from-amber-50/50 to-orange-50/30 rounded-3xl"></div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100 rounded-full -translate-y-16 translate-x-16 opacity-40"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-100 rounded-full translate-y-12 -translate-x-12 opacity-40"></div>
                        
                        <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-amber-100/50 text-center">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-100 rounded-2xl border border-amber-200 mb-6">
                                <ExclamationTriangleIcon className="h-10 w-10 text-amber-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Analysis Required</h2>
                            <p className="text-gray-600 text-lg mb-6 max-w-md mx-auto">
                                You need to analyze prescriptions first to view AI safety recommendations.
                            </p>
                            <button
                                onClick={() => navigate('/')}
                                className="inline-flex items-center gap-3 px-8 py-4 bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                                <LightBulbIcon className="h-5 w-5" />
                                Start New Analysis
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50/30 via-white to-teal-50/30">
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-blue-500 to-indigo-600 rounded-3xl shadow-lg mb-4">
                        <LightBulbIcon className="h-10 w-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold bg-linear-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent mb-3">
                        AI Safety Recommendations
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Personalized medication safety guidance powered by artificial intelligence
                    </p>
                </div>

                {/* Back Button */}
                <div className="mb-8">
                    <button
                        onClick={handleBackToAnalysis}
                        className="group flex items-center gap-3 px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-white/80 rounded-2xl transition-all duration-300 backdrop-blur-sm border border-gray-200 hover:border-gray-300 hover:shadow-lg"
                    >
                        <ArrowLeftIcon className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300" />
                        <span className="font-medium">Back to Analysis Report</span>
                    </button>
                </div>

                {/* Risk Summary Card */}
                <div className="relative overflow-hidden mb-8">
                    <div className="absolute inset-0 bg-linear-to-br from-blue-50/50 to-indigo-50/30 rounded-3xl"></div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full -translate-y-16 translate-x-16 opacity-40"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-100 rounded-full translate-y-12 -translate-x-12 opacity-40"></div>
                    
                    <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-blue-100/50">
                        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Safety Profile</h2>
                                <p className="text-gray-600">Based on your prescription analysis</p>
                            </div>
                            <div className={`px-6 py-3 rounded-full font-bold text-lg uppercase tracking-wider shadow-lg mt-4 lg:mt-0 ${
                                report.risk_level === 'CRITICAL' ? 'bg-linear-to-r from-red-500 to-red-600 text-white animate-pulse' :
                                report.risk_level === 'HIGH' ? 'bg-linear-to-r from-orange-500 to-orange-600 text-white' :
                                report.risk_level === 'MEDIUM' ? 'bg-linear-to-r from-yellow-500 to-yellow-600 text-white' :
                                'bg-linear-to-r from-green-500 to-green-600 text-white'
                            }`}>
                                {report.risk_level} Risk
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center p-6 bg-white/80 rounded-2xl shadow-sm border border-red-100 backdrop-blur-sm">
                                <div className="text-3xl font-bold text-red-600 mb-2">{report.interactions?.length || 0}</div>
                                <div className="text-gray-600 font-medium">Drug Interactions</div>
                            </div>
                            <div className="text-center p-6 bg-white/80 rounded-2xl shadow-sm border border-amber-100 backdrop-blur-sm">
                                <div className="text-3xl font-bold text-amber-600 mb-2">{report.allergy_conflicts?.length || 0}</div>
                                <div className="text-gray-600 font-medium">Allergy Conflicts</div>
                            </div>
                            <div className="text-center p-6 bg-white/80 rounded-2xl shadow-sm border border-blue-100 backdrop-blur-sm">
                                <div className="text-3xl font-bold text-blue-600 mb-2">{report.ai_suggestions?.length || 0}</div>
                                <div className="text-gray-600 font-medium">AI Recommendations</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* AI Recommendations */}
                <div className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-linear-to-br from-white to-gray-50/30 rounded-3xl"></div>
                    <div className="absolute top-0 right-0 w-40 h-40 bg-purple-100 rounded-full -translate-y-20 translate-x-20 opacity-30"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-100 rounded-full translate-y-16 -translate-x-16 opacity-30"></div>
                    
                    <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-100/50">
                        {/* <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl shadow-lg mb-4">
                                <LightBulbIcon className="h-8 w-8 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">Your Personalized Recommendations</h2>
                            <p className="text-gray-600">AI-generated safety guidance for your specific medication profile</p>
                        </div> */}

                        {report.ai_suggestions && report.ai_suggestions.length > 0 ? (
                            <div className="space-y-6">
                                {/* Recommendations Header */}
                                <div className="bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-blue-100 p-3 rounded-2xl">
                                            <LightBulbIcon className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-blue-800 font-semibold text-lg">
                                                {report.ai_suggestions.length} AI-generated recommendation{report.ai_suggestions.length > 1 ? 's' : ''}
                                            </p>
                                            <p className="text-blue-700 text-sm mt-1">
                                                Personalized suggestions based on your medication combination and medical profile
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Recommendations List */}
                                <div className="space-y-6">
                                    {report.ai_suggestions.map((suggestion, index) => (
                                        <div key={index} className="group p-6 bg-white rounded-2xl border-2 border-blue-100 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 hover:scale-[1.02]">
                                            <div className="flex items-start gap-4">
                                                <div className="shrink-0">
                                                    <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center text-lg font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                                                        {index + 1}
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Recommendation {index + 1}</h3>
                                                    <p className="text-gray-700 leading-relaxed text-lg bg-blue-50/50 rounded-xl p-4 border border-blue-100">
                                                        {suggestion}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                {/* Medical Disclaimer */}
                                <div className="bg-linear-to-r from-green-50 to-teal-50 border-2 border-green-200 rounded-2xl p-6 mt-8">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-green-100 p-3 rounded-2xl">
                                            <ShieldCheckIcon className="h-6 w-6 text-green-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-green-800 font-bold text-lg mb-3 flex items-center">
                                                <CheckCircleIcon className="h-5 w-5 mr-2" />
                                                Important Medical Disclaimer
                                            </h3>
                                            <div className="grid md:grid-cols-2 gap-4 text-green-700">
                                                <div className="flex items-start gap-2">
                                                    <span className="bg-green-200 text-green-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5 shrink-0">🏥</span>
                                                    <div>
                                                        <span className="font-semibold">Professional Consultation</span>
                                                        <p className="text-sm">Always consult your healthcare provider before medication changes</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-2">
                                                    <span className="bg-green-200 text-green-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5 shrink-0">📋</span>
                                                    <div>
                                                        <span className="font-semibold">Informational Purpose</span>
                                                        <p className="text-sm">Recommendations supplement but don't replace medical advice</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-2">
                                                    <span className="bg-green-200 text-green-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5 shrink-0">⚕️</span>
                                                    <div>
                                                        <span className="font-semibold">Medical Authority</span>
                                                        <p className="text-sm">Your doctor has final say on medication safety</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-2">
                                                    <span className="bg-green-200 text-green-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5 shrink-0">🔒</span>
                                                    <div>
                                                        <span className="font-semibold">Data Privacy</span>
                                                        <p className="text-sm">Your health information is processed securely</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col lg:flex-row gap-4 pt-6">
                                    {/* <button
                                        onClick={handleBackToAnalysis}
                                        className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-2xl transition-all duration-300 border border-gray-300 hover:shadow-lg"
                                    >
                                        <ArrowLeftIcon className="h-5 w-5" />
                                        Back to Full Analysis Report
                                    </button> */}
                                    <button
                                        onClick={() => navigate('/')}
                                        className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                                    >
                                        <LightBulbIcon className="h-5 w-5" />
                                        Start New Analysis
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-2xl border border-green-200 mb-6">
                                    <CheckCircleIcon className="h-10 w-10 text-green-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-3">No Additional Recommendations Needed</h3>
                                <p className="text-gray-600 text-lg mb-6 max-w-md mx-auto">
                                    Your current medication combination appears to be well-managed based on our comprehensive AI analysis.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <button
                                        onClick={handleBackToAnalysis}
                                        className="flex items-center justify-center gap-3 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-300 border border-gray-300"
                                    >
                                        <ArrowLeftIcon className="h-5 w-5" />
                                        Back to Analysis
                                    </button>
                                    <button
                                        onClick={() => navigate('/')}
                                        className="flex items-center justify-center gap-3 px-6 py-3 bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                                    >
                                        <LightBulbIcon className="h-5 w-5" />
                                        New Analysis
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RecommendationsPage;