import React from 'react';
import { BeakerIcon, ExclamationTriangleIcon, ShieldExclamationIcon, CheckCircleIcon } from '@heroicons/react/24/solid';

const getRiskClasses = (level) => {
    switch (level) {
        case 'CRITICAL': return 'from-red-500 to-red-700 text-white';
        case 'HIGH': return 'from-amber-500 to-amber-700 text-white';
        case 'MEDIUM': return 'from-blue-500 to-blue-700 text-white';
        case 'LOW': return 'from-green-500 to-green-700 text-white';
        default: return 'from-gray-500 to-gray-700 text-white';
    }
};

const RiskIndicator = ({ level }) => (
    <div className="flex items-center justify-center gap-4">
        <span className={`px-6 py-2 rounded-full font-bold text-lg uppercase tracking-wider shadow-lg risk-level-badge risk-${level.toLowerCase()}`}>
            {level}
        </span>
        <p className="text-xl font-semibold">Overall Risk Level</p>
    </div>
);

const Section = ({ title, icon, children, count }) => (
    <div className="card p-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center mb-4">
            {icon}
            <span className="ml-3">{title}</span>
            {count > 0 && <span className="ml-auto bg-gray-200 text-gray-700 text-sm font-bold px-2 py-1 rounded-full">{count}</span>}
        </h3>
        {children}
    </div>
);

function AnalysisReport({ report }) {
    return (
        <div className="space-y-8">
            {/* Summary Message */}
            <div className={`p-6 rounded-xl shadow-lg bg-gradient-to-br ${getRiskClasses(report.risk_level)}`}>
                <h2 className="text-3xl font-bold mb-4">{report.message}</h2>
                <RiskIndicator level={report.risk_level} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Drug Interactions */}
                <Section 
                    title="Drug-Drug Interactions" 
                    icon={<ExclamationTriangleIcon className="h-7 w-7 text-red-500" />}
                    count={report.interactions.length}
                >
                    {report.interactions.length > 0 ? (
                        <ul className="space-y-4">
                            {report.interactions.map((item, index) => (
                                <li key={index} className="p-4 bg-red-50 rounded-lg border-l-4 border-red-400">
                                    <p className="font-bold text-red-800">{item.pair}</p>
                                    <p className="text-gray-700 mt-1">{item.reason}</p>
                                    <p className="text-sm font-semibold text-red-600 mt-2">Severity: {item.severity.toUpperCase()}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="flex items-center text-green-700">
                            <CheckCircleIcon className="h-6 w-6 mr-2"/>
                            <p>No dangerous drug-drug interactions found.</p>
                        </div>
                    )}
                </Section>

                {/* Allergy Conflicts */}
                <Section 
                    title="Allergy Conflicts" 
                    icon={<ShieldExclamationIcon className="h-7 w-7 text-amber-600" />}
                    count={report.allergy_conflicts.length}
                >
                    {report.allergy_conflicts.length > 0 ? (
                        <ul className="space-y-4">
                            {report.allergy_conflicts.map((item, index) => (
                                <li key={index} className="p-4 bg-amber-50 rounded-lg border-l-4 border-amber-400">
                                    <p className="font-bold text-amber-800">Medicine: {item.medicine}</p>
                                    <p className="text-gray-700 mt-1">{item.reason}</p>
                                    <p className="text-sm font-semibold text-amber-600 mt-2">Allergy: {item.allergy}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="flex items-center text-green-700">
                            <CheckCircleIcon className="h-6 w-6 mr-2"/>
                            <p>No conflicts with your submitted allergies found.</p>
                        </div>
                    )}
                </Section>
            </div>

            {/* Medicine Lists */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Section title="Medicines from Prescription 1" icon={<BeakerIcon className="h-7 w-7 text-blue-500" />}>
                    {report.doctorA_medicines.length > 0 ? (
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            {report.doctorA_medicines.map((med, i) => <li key={i} className="capitalize">{med}</li>)}
                        </ul>
                    ) : <p className="text-gray-500">No medicines identified.</p>}
                </Section>
                <Section title="Medicines from Prescription 2" icon={<BeakerIcon className="h-7 w-7 text-emerald-500" />}>
                    {report.doctorB_medicines.length > 0 ? (
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            {report.doctorB_medicines.map((med, i) => <li key={i} className="capitalize">{med}</li>)}
                        </ul>
                    ) : <p className="text-gray-500">No medicines identified.</p>}
                </Section>
            </div>
        </div>
    );
}

export default AnalysisReport;
