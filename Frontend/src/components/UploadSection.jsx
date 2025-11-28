import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { DocumentArrowUpIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { useStore } from '../store';

const Dropzone = ({ getRootProps, getInputProps, isDragActive, file, label }) => (
    <div>
        <label className="block text-lg font-semibold text-gray-700 mb-2">{label}</label>
        <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 
                ${isDragActive ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300 hover:border-indigo-500'}
                flex flex-col items-center justify-center h-48`}
        >
            <input {...getInputProps()} />
            <DocumentArrowUpIcon className="h-12 w-12 text-gray-400 mb-2" />
            {file ? (
                <p className="mt-2 text-gray-800 font-medium">{file.name}</p>
            ) : (
                <p className="mt-2 text-gray-500">Drop file here, or click to select</p>
            )}
        </div>
    </div>
);

function UploadSection({ onAnalyze, isLoading }) {
    const { user } = useStore();
    const [prescription1, setPrescription1] = useState(null);
    const [prescription2, setPrescription2] = useState(null);
    const [allergies, setAllergies] = useState('');

    // Load user's allergies when component mounts or user data changes
    useEffect(() => {
        if (user && user.allergies && Array.isArray(user.allergies)) {
            setAllergies(user.allergies.join(', '));
        }
    }, [user, user?.allergies]);

    const onDrop1 = useCallback(acceptedFiles => {
        setPrescription1(acceptedFiles[0]);
    }, []);
    const onDrop2 = useCallback(acceptedFiles => {
        setPrescription2(acceptedFiles[0]);
    }, []);

    const { getRootProps: getRootProps1, getInputProps: getInputProps1, isDragActive: isDragActive1 } = useDropzone({ 
        onDrop: onDrop1, 
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg'],
            'application/pdf': ['.pdf'],
            'text/plain': ['.txt']
        }, 
        maxFiles: 1 
    });
    const { getRootProps: getRootProps2, getInputProps: getInputProps2, isDragActive: isDragActive2 } = useDropzone({ 
        onDrop: onDrop2, 
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg'],
            'application/pdf': ['.pdf'],
            'text/plain': ['.txt']
        }, 
        maxFiles: 1 
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onAnalyze({ prescription1, prescription2, allergies });
    };

    return (
        <div className="card p-8 animate-fadeIn">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Upload Your Prescriptions</h2>
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Dropzone getRootProps={getRootProps1} getInputProps={getInputProps1} isDragActive={isDragActive1} file={prescription1} label="Prescription #1" />
                    <Dropzone getRootProps={getRootProps2} getInputProps={getInputProps2} isDragActive={isDragActive2} file={prescription2} label="Prescription #2" />
                </div>
                <div>
                    <label htmlFor="allergies" className="block text-lg font-semibold text-gray-700 mb-2">
                        Known Allergies (e.g., penicillin, sulfa)
                        {user && user.allergies && user.allergies.length > 0 && (
                            <span className="text-sm text-indigo-600 font-normal ml-2">
                                (loaded from your profile)
                            </span>
                        )}
                    </label>
                    <input
                        type="text"
                        id="allergies"
                        value={allergies}
                        onChange={(e) => setAllergies(e.target.value)}
                        placeholder="Enter comma-separated allergies..."
                        className="input-field"
                    />
                </div>
                <div className="text-center pt-4">
                    <button
                        type="submit"
                        disabled={isLoading || !prescription1 || !prescription2}
                        className="btn-primary w-full md:w-auto px-12 py-4 text-lg rounded-full disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        <div className="flex items-center justify-center">
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Analyzing...</span>
                                </>
                            ) : (
                                <>
                                    <SparklesIcon className="h-6 w-6 mr-2" />
                                    <span>Analyze Now</span>
                                </>
                            )}
                        </div>
                    </button>
                </div>
            </form>
        </div>
    );
}


export default UploadSection;
