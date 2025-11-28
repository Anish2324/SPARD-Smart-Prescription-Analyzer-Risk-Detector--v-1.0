import React, { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import UploadSection from './components/UploadSection';
import AnalysisReport from './components/AnalysisReport';
import Login from './components/Login';
import Register from './components/Register';
import WelcomeSection from './components/WelcomeSection';
import AllergyManager from './components/AllergyManager';
import { useStore } from './store';

function App() {
    const { report, setReport, isLoading, setIsLoading, isAuthenticated, login, register } = useStore();
    const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'

    const handleAnalyze = async ({ prescription1, prescription2, allergies }) => {
        if (!prescription1 || !prescription2) {
            toast.error('Please upload both prescriptions.');
            return;
        }

        setIsLoading(true);
        setReport(null);

        const formData = new FormData();
        formData.append('prescription1', prescription1);
        formData.append('prescription2', prescription2);
        formData.append('allergies', allergies);

        const toastId = toast.loading('Analyzing prescriptions... This may take a moment.');

        try {
            const response = await axios.post('http://127.0.0.1:5000/api/analyze', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            setReport(response.data);
            toast.success('Analysis complete!', { id: toastId });

        } catch (error) {
            console.error('Analysis failed:', error);
            const errorMessage = error.response?.data?.error 
                ? `Analysis failed: ${error.response.data.error}`
                : 'An unexpected error occurred. Please try again.';
            toast.error(errorMessage, { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };

    // Authentication handlers
    const handleLogin = (userData) => {
        login(userData);
    };

    const handleRegister = (userData) => {
        register(userData);
    };

    // Show auth pages if not authenticated
    if (!isAuthenticated) {
        return (
            <>
                <Toaster 
                    position="top-center" 
                    reverseOrder={false}
                    toastOptions={{
                        style: {
                            borderRadius: '12px',
                            background: '#fff',
                            color: '#374151',
                        },
                    }}
                />
                {authMode === 'login' ? (
                    <Login 
                        onLogin={handleLogin} 
                        onSwitchToRegister={() => setAuthMode('register')} 
                    />
                ) : (
                    <Register 
                        onRegister={handleRegister} 
                        onSwitchToLogin={() => setAuthMode('login')} 
                    />
                )}
            </>
        );
    }

    // Main app for authenticated users
    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Toaster position="top-center" reverseOrder={false} />
            <Header />
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <WelcomeSection />
                    
                    {/* Allergy Management Section */}
                    <div className="mb-8">
                        <AllergyManager />
                    </div>
                    
                    <UploadSection onAnalyze={handleAnalyze} isLoading={isLoading} />
                    {isLoading && (
                        <div className="text-center p-8">
                            <div className="animate-spin-slow h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto"></div>
                            <p className="mt-4 text-lg font-semibold text-gray-700">Processing your prescriptions...</p>
                        </div>
                    )}
                    {report && (
                        <div className="mt-12 animate-fadeIn">
                            <AnalysisReport report={report} />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default App;

