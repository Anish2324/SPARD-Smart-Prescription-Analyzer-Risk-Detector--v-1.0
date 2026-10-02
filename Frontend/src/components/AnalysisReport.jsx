import React from 'react';
import { Link } from 'react-router-dom';
import { BeakerIcon, ExclamationTriangleIcon, ShieldExclamationIcon, CheckCircleIcon, HeartIcon, XCircleIcon, LightBulbIcon } from '@heroicons/react/24/solid';

const getRiskClasses = (level) => {
    switch (level) {
        case 'CRITICAL': return 'from-red-600 to-red-800 text-white shadow-lg shadow-red-500/30';
        case 'HIGH': return 'from-orange-500 to-orange-700 text-white shadow-lg shadow-orange-500/30';
        case 'MEDIUM': return 'from-yellow-500 to-yellow-600 text-white shadow-lg shadow-yellow-500/30';
        case 'LOW': return 'from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30';
        default: return 'from-gray-500 to-gray-700 text-white';
    }
};

const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
        case 'critical': return 'bg-red-50 border-red-200 text-red-800 shadow-sm';
        case 'high': return 'bg-orange-50 border-orange-200 text-orange-800 shadow-sm';
        case 'medium': return 'bg-yellow-50 border-yellow-200 text-yellow-800 shadow-sm';
        case 'low': return 'bg-green-50 border-green-200 text-green-800 shadow-sm';
        default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
};

const getSeverityIcon = (severity) => {
    switch (severity?.toLowerCase()) {
        case 'critical': return <XCircleIcon className="h-6 w-6 text-red-500" />;
        case 'high': return <ExclamationTriangleIcon className="h-6 w-6 text-orange-500" />;
        case 'medium': return <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500" />;
        case 'low': return <CheckCircleIcon className="h-6 w-6 text-green-500" />;
        default: return <CheckCircleIcon className="h-6 w-6 text-gray-500" />;
    }
};

const RiskIndicator = ({ level }) => (
    <div className="flex items-center justify-center gap-4">
        <span className={`px-8 py-3 rounded-full font-bold text-lg uppercase tracking-wider shadow-lg risk-level-badge risk-${level.toLowerCase()}`}>
            {level}
        </span>
        <p className="text-xl font-semibold">Overall Risk Level</p>
    </div>
);

const Section = ({ title, icon, children, count, className = "" }) => (
    <div className={`bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100/50 ${className}`}>
        <h3 className="text-xl font-bold text-gray-800 flex items-center mb-4">
            {icon}
            <span className="ml-3">{title}</span>
            {count > 0 && (
                <span className="ml-auto bg-gray-100 text-gray-700 text-sm font-bold px-3 py-1 rounded-full border border-gray-200">
                    {count} found
                </span>
            )}
        </h3>
        {children}
    </div>
);

function AnalysisReport({ report }) {
    const totalMedicines = (report.doctorA_medicines?.length || 0) + (report.doctorB_medicines?.length || 0);
    const totalRisks = (report.interactions?.length || 0) + (report.allergy_conflicts?.length || 0);
    const criticalInteractions = report.interactions?.filter(i => i.severity?.toLowerCase() === 'critical').length || 0;

    return (
        <div className="space-y-8 max-w-7xl mx-auto px-4">
            {/* Header Section */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-blue-500 to-teal-400 rounded-3xl shadow-lg mb-4">
                    <BeakerIcon className="h-10 w-10 text-white" />
                </div>
                <h1 className="text-4xl font-bold bg-linear-to-r from-blue-700 to-teal-600 bg-clip-text text-transparent mb-3">
                    Prescription Safety Report
                </h1>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                    Comprehensive drug interaction and allergy conflict analysis for your safety
                </p>
                <div className="flex justify-center items-center space-x-6 mt-4 text-sm text-gray-500">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">📊 {totalMedicines} medicines analyzed</span>
                    <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full">⚠️ {totalRisks} potential risks</span>
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">📅 {new Date().toLocaleDateString()}</span>
                </div>
            </div>

            {/* Enhanced Summary Message */}
            <div className="relative overflow-hidden rounded-3xl shadow-2xl border border-gray-200">
                {/* Risk Level Header */}
                <div className={`p-8 text-center bg-linear-to-r ${getRiskClasses(report.risk_level)} relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-center mb-4">
                            {report.risk_level === 'CRITICAL' && <ExclamationTriangleIcon className="h-10 w-10 mr-3 animate-pulse" />}
                            {report.risk_level === 'HIGH' && <ExclamationTriangleIcon className="h-10 w-10 mr-3" />}
                            {report.risk_level === 'MEDIUM' && <ExclamationTriangleIcon className="h-10 w-10 mr-3" />}
                            {report.risk_level === 'LOW' && <CheckCircleIcon className="h-10 w-10 mr-3" />}
                            <span className="text-4xl font-bold tracking-wide drop-shadow-lg">{report.risk_level} RISK</span>
                        </div>
                        <p className="text-xl font-medium opacity-95">Safety Assessment Complete</p>
                    </div>
                </div>

                {/* Main Message Content */}
                <div className="p-8 bg-white/95 backdrop-blur-sm">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-50 rounded-2xl border border-blue-200 mb-4">
                            <BeakerIcon className="h-10 w-10 text-blue-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Analysis Results</h3>
                        <p className="text-gray-700 text-lg leading-relaxed max-w-3xl mx-auto bg-blue-50/50 rounded-xl p-6 border border-blue-100">
                            {report.message}
                        </p>
                    </div>

                    {/* Critical Alert */}
                    {criticalInteractions > 0 && (
                        <div className="bg-linear-to-r from-red-50 to-red-100 border-2 border-red-300 rounded-2xl p-6 mb-6 shadow-lg">
                            <div className="flex items-center justify-center mb-4">
                                <div className="bg-red-500 p-3 rounded-full mr-4 animate-pulse shadow-lg">
                                    <ExclamationTriangleIcon className="h-8 w-8 text-white" />
                                </div>
                                <h4 className="text-2xl font-bold text-red-800">Urgent Medical Attention Required</h4>
                            </div>
                            <p className="text-red-700 text-center font-semibold text-lg">
                                {criticalInteractions} CRITICAL interaction{criticalInteractions > 1 ? 's' : ''} detected. 
                                <br />
                                <span className="text-red-800 underline">Contact your healthcare provider immediately.</span>
                            </p>
                        </div>
                    )}

                    {/* Next Steps */}
                    <div className="bg-linear-to-r from-blue-50 to-teal-50 border border-blue-200 rounded-2xl p-6 shadow-sm">
                        <h4 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
                            <CheckCircleIcon className="h-6 w-6 mr-3 text-blue-600" />
                            Recommended Next Steps
                        </h4>
                        <ul className="space-y-3 text-blue-800">
                            <li className="flex items-start bg-white/50 p-3 rounded-xl">
                                <span className="font-bold text-blue-600 mr-3 bg-blue-100 w-6 h-6 rounded-full text-center text-sm leading-6">1</span>
                                <span>Review all identified interactions and allergy conflicts below</span>
                            </li>
                            <li className="flex items-start bg-white/50 p-3 rounded-xl">
                                <span className="font-bold text-blue-600 mr-3 bg-blue-100 w-6 h-6 rounded-full text-center text-sm leading-6">2</span>
                                <span>Consult with your healthcare provider about any concerns</span>
                            </li>
                            <li className="flex items-start bg-white/50 p-3 rounded-xl">
                                <span className="font-bold text-blue-600 mr-3 bg-blue-100 w-6 h-6 rounded-full text-center text-sm leading-6">3</span>
                                <span>
                                    <Link to="/recommendations" className="text-blue-600 hover:text-blue-800 underline font-medium flex items-center">
                                        View detailed AI safety recommendations 
                                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </span>
                            </li>
                            {criticalInteractions > 0 && (
                                <li className="flex items-start bg-red-50/80 p-3 rounded-xl border border-red-200">
                                    <span className="font-bold text-red-600 mr-3 bg-red-100 w-6 h-6 rounded-full text-center text-sm leading-6">⚠️</span>
                                    <span className="font-semibold text-red-700">Seek immediate medical attention for critical interactions</span>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Risk Analysis Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Drug Interactions */}
                <Section 
                    title="Drug-Drug Interactions" 
                    icon={<HeartIcon className="h-7 w-7 text-red-500" />}
                    count={report.interactions?.length || 0}
                >
                    {report.interactions?.length > 0 ? (
                        <div className="space-y-4">
                            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-4">
                                <p className="text-red-800 font-semibold flex items-center text-lg">
                                    <ExclamationTriangleIcon className="h-6 w-6 mr-2" />
                                    {report.interactions.length} dangerous interaction{report.interactions.length > 1 ? 's' : ''} detected!
                                </p>
                                <p className="text-red-700 text-sm mt-2">
                                    Taking these medicines together may cause serious health risks.
                                </p>
                            </div>
                            
                            {report.interactions.map((item, index) => (
                                <div key={index} className={`p-5 rounded-xl border-l-4 ${getSeverityColor(item.severity)} transition-all duration-200 hover:shadow-md`}>
                                    <div className="flex items-start gap-3">
                                        <div className="shrink-0 mt-1">
                                            {getSeverityIcon(item.severity)}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-lg text-gray-800 mb-2">{item.pair}</p>
                                            <p className="text-gray-700 mb-3 leading-relaxed">{item.reason}</p>
                                            <div className="flex items-center justify-between">
                                                <span className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider ${getSeverityColor(item.severity)} border`}>
                                                    {item.severity} Risk
                                                </span>
                                                {item.severity?.toLowerCase() === 'critical' && (
                                                    <span className="text-red-600 text-sm font-semibold animate-pulse bg-red-100 px-3 py-1 rounded-full">
                                                        ⚠️ Immediate Attention
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-4">
                                <p className="text-blue-800 font-semibold text-sm flex items-start">
                                    <LightBulbIcon className="h-5 w-5 mr-2 mt-0.5 text-blue-600 shrink-0" />
                                    <span>
                                        Recommendation: Consult your doctor before taking these medications together. 
                                        They may need to adjust dosages, timing, or prescribe alternatives.
                                    </span>
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center p-8 bg-green-50 rounded-xl border-2 border-green-200">
                            <CheckCircleIcon className="h-12 w-12 text-green-600 mr-4"/>
                            <div>
                                <p className="font-bold text-green-800 text-lg">No Drug Interactions Found</p>
                                <p className="text-green-700">Your medicines appear to be safe to take together.</p>
                            </div>
                        </div>
                    )}
                </Section>

                {/* Allergy Conflicts */}
                <Section 
                    title="Allergy Conflicts" 
                    icon={<ShieldExclamationIcon className="h-7 w-7 text-amber-600" />}
                    count={report.allergy_conflicts?.length || 0}
                >
                    {report.allergy_conflicts?.length > 0 ? (
                        <div className="space-y-4">
                            <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 mb-4">
                                <p className="text-amber-800 font-semibold flex items-center text-lg">
                                    <ShieldExclamationIcon className="h-6 w-6 mr-2" />
                                    {report.allergy_conflicts.length} allergy conflict{report.allergy_conflicts.length > 1 ? 's' : ''} detected!
                                </p>
                                <p className="text-amber-700 text-sm mt-2">
                                    These medicines may cause allergic reactions based on your medical history.
                                </p>
                            </div>
                            
                            {report.allergy_conflicts.map((item, index) => (
                                <div key={index} className="p-5 bg-amber-50 rounded-xl border-l-4 border-amber-400 shadow-sm transition-all duration-200 hover:shadow-md">
                                    <div className="flex items-start gap-3">
                                        <XCircleIcon className="h-6 w-6 text-amber-600 mt-1 shrink-0" />
                                        <div className="flex-1">
                                            <p className="font-bold text-lg text-amber-800 mb-2 capitalize">
                                                {item.medicine}
                                            </p>
                                            <p className="text-gray-700 mb-3 leading-relaxed">{item.reason}</p>
                                            <div className="flex items-center justify-between">
                                                <span className="px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider bg-amber-200 text-amber-800 border border-amber-300">
                                                    {item.allergy} Allergy
                                                </span>
                                                <span className="text-amber-700 text-sm font-semibold bg-amber-100 px-3 py-1 rounded-full">
                                                    ⚠️ Avoid this medication
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mt-4">
                                <p className="text-purple-800 font-semibold text-sm flex items-start">
                                    <ShieldExclamationIcon className="h-5 w-5 mr-2 mt-0.5 text-purple-600 shrink-0" />
                                    <span>
                                        Important: Inform your doctor about these allergy conflicts. 
                                        They can prescribe alternative medicines that are safe for you.
                                    </span>
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center p-8 bg-green-50 rounded-xl border-2 border-green-200">
                            <CheckCircleIcon className="h-12 w-12 text-green-600 mr-4"/>
                            <div>
                                <p className="font-bold text-green-800 text-lg">No Allergy Conflicts</p>
                                <p className="text-green-700">
                                    {report.patient_allergies_submitted && report.patient_allergies_submitted.length > 0 
                                        ? "None of your medicines conflict with your known allergies." 
                                        : "No allergy information provided for comparison."}
                                </p>
                            </div>
                        </div>
                    )}
                </Section>
            </div>

            {/* Medicine Lists and Patient Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Section 
                    title="Medicines from Prescription 1" 
                    icon={<BeakerIcon className="h-6 w-6 text-blue-500" />}
                    className="text-center"
                >
                    {report.doctorA_medicines?.length > 0 ? (
                        <div className="space-y-3">
                            {report.doctorA_medicines.map((med, i) => (
                                <div key={i} className="flex items-center p-4 bg-blue-50 rounded-xl border border-blue-200 hover:bg-blue-100 transition-colors">
                                    <BeakerIcon className="h-5 w-5 text-blue-600 mr-3 shrink-0" />
                                    <span className="capitalize font-medium text-gray-800 text-left">{med}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-6 text-gray-500">
                            <BeakerIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            No medicines identified
                        </div>
                    )}
                </Section>
                
                <Section 
                    title="Medicines from Prescription 2" 
                    icon={<BeakerIcon className="h-6 w-6 text-emerald-500" />}
                    className="text-center"
                >
                    {report.doctorB_medicines?.length > 0 ? (
                        <div className="space-y-3">
                            {report.doctorB_medicines.map((med, i) => (
                                <div key={i} className="flex items-center p-4 bg-emerald-50 rounded-xl border border-emerald-200 hover:bg-emerald-100 transition-colors">
                                    <BeakerIcon className="h-5 w-5 text-emerald-600 mr-3 shrink-0" />
                                    <span className="capitalize font-medium text-gray-800 text-left">{med}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-6 text-gray-500">
                            <BeakerIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            No medicines identified
                        </div>
                    )}
                </Section>
                
                <Section 
                    title="Patient Allergies" 
                    icon={<ShieldExclamationIcon className="h-6 w-6 text-purple-500" />}
                    className="text-center"
                >
                    {report.patient_allergies?.filter(allergy => allergy && typeof allergy === 'string' && allergy.trim() && allergy.trim().toLowerCase() !== 'undefined' && allergy.trim().toLowerCase() !== 'null').length > 0 ? (
                        <div className="space-y-3">
                            {report.patient_allergies
                                .filter(allergy => allergy && typeof allergy === 'string' && allergy.trim() && allergy.trim().toLowerCase() !== 'undefined' && allergy.trim().toLowerCase() !== 'null')
                                .map((allergy, i) => (
                                <div key={i} className="flex items-center p-4 bg-purple-50 rounded-xl border border-purple-200 hover:bg-purple-100 transition-colors">
                                    <ShieldExclamationIcon className="h-5 w-5 text-purple-600 mr-3 shrink-0" />
                                    <span className="capitalize font-medium text-gray-800 text-left">{allergy}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-xl border border-gray-200">
                            <ShieldExclamationIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p>No allergies provided</p>
                            <p className="text-sm text-gray-400 mt-1">Add allergies for better analysis</p>
                        </div>
                    )}
                </Section>
            </div>

            {/* Analysis Summary Stats */}
            <div className="bg-linear-to-r from-blue-50/80 to-teal-50/80 rounded-3xl p-8 border border-blue-200/50 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Analysis Summary</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center p-6 bg-white/80 rounded-2xl shadow-sm border border-blue-100 backdrop-blur-sm">
                        <div className="text-3xl font-bold text-blue-600 mb-2">
                            {(report.doctorA_medicines?.length || 0) + (report.doctorB_medicines?.length || 0)}
                        </div>
                        <div className="text-gray-600 font-medium">Total Medicines</div>
                    </div>
                    <div className="text-center p-6 bg-white/80 rounded-2xl shadow-sm border border-red-100 backdrop-blur-sm">
                        <div className="text-3xl font-bold text-red-600 mb-2">{report.interactions?.length || 0}</div>
                        <div className="text-gray-600 font-medium">Drug Interactions</div>
                    </div>
                    <div className="text-center p-6 bg-white/80 rounded-2xl shadow-sm border border-amber-100 backdrop-blur-sm">
                        <div className="text-3xl font-bold text-amber-600 mb-2">{report.allergy_conflicts?.length || 0}</div>
                        <div className="text-gray-600 font-medium">Allergy Conflicts</div>
                    </div>
                    <div className="text-center p-6 bg-white/80 rounded-2xl shadow-sm border border-green-100 backdrop-blur-sm">
                        <div className={`text-3xl font-bold mb-2 ${
                            report.risk_level === 'CRITICAL' ? 'text-red-600' :
                            report.risk_level === 'HIGH' ? 'text-orange-600' :
                            report.risk_level === 'MEDIUM' ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                            {report.risk_level || 'SAFE'}
                        </div>
                        <div className="text-gray-600 font-medium">Risk Level</div>
                    </div>
                </div>
                
                {/* View Recommendations Button */}
                {report.ai_suggestions && report.ai_suggestions.length > 0 && (
                    <div className="text-center mt-8">
                        <Link
                            to="/recommendations"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            <LightBulbIcon className="h-6 w-6" />
                            View {report.ai_suggestions.length} AI Safety Recommendation{report.ai_suggestions.length > 1 ? 's' : ''}
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AnalysisReport;