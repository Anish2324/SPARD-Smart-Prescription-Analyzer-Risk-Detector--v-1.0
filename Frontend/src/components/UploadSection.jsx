import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { DocumentArrowUpIcon, SparklesIcon, XMarkIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useStore } from '../store';

const Dropzone = ({ getRootProps, getInputProps, isDragActive, file, label, onRemove }) => (
    <div className="relative">
        <label className="block text-lg font-semibold text-gray-800 mb-3 items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            {label}
        </label>
        <div
            {...getRootProps()}
            className={`relative border-3 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 
                ${isDragActive 
                    ? 'border-blue-500 bg-blue-50/50 shadow-lg scale-[1.02]' 
                    : file 
                    ? 'border-green-400 bg-green-50/30 shadow-md'
                    : 'border-blue-200 hover:border-blue-400 hover:bg-blue-50/30 hover:shadow-md'
                }
                flex flex-col items-center justify-center h-52 group backdrop-blur-sm`}
        >
            <input {...getInputProps()} />
            
            {/* File Upload Icon */}
            <div className={`relative mb-4 transition-transform duration-300 ${isDragActive ? 'scale-110' : ''}`}>
                <div className="absolute inset-0 bg-blue-100 rounded-full transform scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <DocumentArrowUpIcon className={`h-14 w-14 relative z-10 ${
                    file ? 'text-green-500' : isDragActive ? 'text-blue-500' : 'text-blue-300'
                } transition-colors duration-300`} />
            </div>

            {/* File Status Content */}
            {file ? (
                <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2">
                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                        <p className="text-gray-800 font-semibold text-lg">{file.name}</p>
                    </div>
                    <p className="text-sm text-green-600 font-medium">Ready for analysis</p>
                    <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
            ) : (
                <div className="space-y-2">
                    <p className="text-gray-700 font-medium text-lg">
                        {isDragActive ? 'Drop your file here' : 'Click to upload or drag & drop'}
                    </p>
                    <p className="text-gray-500 text-sm">
                        Supports: JPG, PNG, PDF, TXT
                    </p>
                    <div className="flex justify-center gap-1 mt-2">
                        {['JPG', 'PNG', 'PDF', 'TXT'].map((format) => (
                            <span key={format} className="bg-blue-100 text-blue-600 px-2 py-1 rounded-lg text-xs font-medium">
                                {format}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Remove File Button */}
            {file && (
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove();
                    }}
                    className="absolute top-3 right-3 p-2 bg-red-100 text-red-500 rounded-full hover:bg-red-200 transition-colors duration-200 group/remove"
                    title="Remove file"
                >
                    <XMarkIcon className="h-4 w-4 group-hover/remove:scale-110 transition-transform" />
                </button>
            )}
        </div>
    </div>
);

function UploadSection({ onAnalyze }) {
    const { isLoading } = useStore();
    const [prescription1, setPrescription1] = useState(null);
    const [prescription2, setPrescription2] = useState(null);

    const onDrop1 = useCallback(acceptedFiles => {
        if (acceptedFiles && acceptedFiles[0]) {
            setPrescription1(acceptedFiles[0]);
        }
    }, []);

    const onDrop2 = useCallback(acceptedFiles => {
        if (acceptedFiles && acceptedFiles[0]) {
            setPrescription2(acceptedFiles[0]);
        }
    }, []);

    const removeFile1 = useCallback(() => {
        setPrescription1(null);
    }, []);

    const removeFile2 = useCallback(() => {
        setPrescription2(null);
    }, []);

    const { getRootProps: getRootProps1, getInputProps: getInputProps1, isDragActive: isDragActive1 } = useDropzone({ 
        onDrop: onDrop1, 
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg'],
            'application/pdf': ['.pdf'],
            'text/plain': ['.txt']
        }, 
        maxFiles: 1,
        maxSize: 10 * 1024 * 1024, // 10MB
    });
    
    const { getRootProps: getRootProps2, getInputProps: getInputProps2, isDragActive: isDragActive2 } = useDropzone({ 
        onDrop: onDrop2, 
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg'],
            'application/pdf': ['.pdf'],
            'text/plain': ['.txt']
        }, 
        maxFiles: 1,
        maxSize: 10 * 1024 * 1024, // 10MB
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (prescription1 && prescription2) {
            onAnalyze({ prescription1, prescription2 });
        }
    };

    const isFormValid = prescription1 && prescription2;

    return (
        <div className="relative">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-linear-to-br from-blue-50/50 to-teal-50/30 rounded-3xl -z-10"></div>
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-100 rounded-full -translate-y-20 translate-x-20 opacity-40"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-100 rounded-full translate-y-16 -translate-x-16 opacity-40"></div>
            
            {/* Main Content */}
            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-blue-100/50">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-blue-500 to-teal-400 rounded-2xl shadow-lg mb-4">
                        <DocumentArrowUpIcon className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold bg-linear-to-r from-blue-700 to-teal-600 bg-clip-text text-transparent mb-3">
                        Upload Your Prescriptions
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Upload two prescriptions to check for potential drug interactions and safety concerns
                    </p>
                </div>

                {/* Upload Form */}
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <Dropzone 
                            getRootProps={getRootProps1} 
                            getInputProps={getInputProps1} 
                            isDragActive={isDragActive1} 
                            file={prescription1} 
                            label="First Prescription"
                            onRemove={removeFile1}
                        />
                        <Dropzone 
                            getRootProps={getRootProps2} 
                            getInputProps={getInputProps2} 
                            isDragActive={isDragActive2} 
                            file={prescription2} 
                            label="Second Prescription"
                            onRemove={removeFile2}
                        />
                    </div>

                    {/* Security Notice */}
                    <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-100 p-2 rounded-full">
                                <SparklesIcon className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-blue-800 font-medium">Your data is secure</p>
                                <p className="text-blue-600 text-sm">
                                    All files are processed securely and your information is protected
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="text-center pt-6">
                        <button
                            type="submit"
                            disabled={isLoading || !isFormValid}
                            className={`relative inline-flex items-center justify-center px-12 py-4 text-lg font-semibold rounded-2xl transition-all duration-300 transform
                                ${isFormValid && !isLoading
                                    ? 'bg-linear-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 shadow-lg hover:shadow-xl hover:scale-105 text-white'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-inner'
                                } 
                                ${isLoading ? 'loading' : ''}
                                min-w-[200px]`}
                        >
                            <div className="flex items-center justify-center gap-3">
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                                        <span>Analyzing Prescriptions...</span>
                                    </>
                                ) : (
                                    <>
                                        <SparklesIcon className="h-6 w-6" />
                                        <span>Analyze for Safety</span>
                                    </>
                                )}
                            </div>
                            
                            {/* Button Shine Effect */}
                            {isFormValid && !isLoading && (
                                <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shine"></div>
                            )}
                        </button>
                        
                        {/* Helper Text */}
                        {!isFormValid && (
                            <p className="text-gray-500 text-sm mt-4">
                                Please upload both prescriptions to begin safety analysis
                            </p>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UploadSection;