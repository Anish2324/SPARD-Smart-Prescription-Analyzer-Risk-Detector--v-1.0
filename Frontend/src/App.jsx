import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import HomePage from './pages/HomePage';
import AnalysisPage from './pages/AnalysisPage';
import RecommendationsPage from './pages/RecommendationsPage';
import { useStore } from './store';

function App() {
    const { isAuthenticated, login, register } = useStore();
    const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'

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
            <div className="min-h-screen bg-linear-to-br from-blue-50/30 via-white to-teal-50/30 font-sans flex flex-col">
                <Toaster 
                    position="top-center" 
                    reverseOrder={false}
                    toastOptions={{
                        duration: 4000,
                        style: {
                            borderRadius: '16px',
                            background: '#fff',
                            color: '#374151',
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                            border: '1px solid #e5e7eb',
                            padding: '16px 20px',
                            fontSize: '14px',
                            fontWeight: '500',
                        },
                        success: {
                            style: {
                                background: '#f0fdf4',
                                color: '#166534',
                                border: '1px solid #bbf7d0',
                            },
                        },
                        error: {
                            style: {
                                background: '#fef2f2',
                                color: '#dc2626',
                                border: '1px solid #fecaca',
                            },
                        },
                        loading: {
                            style: {
                                background: '#fffbeb',
                                color: '#d97706',
                                border: '1px solid #fed7aa',
                            },
                        },
                    }}
                />
                <main className="flex-1 flex items-center justify-center">
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
                </main>
                <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200/50 py-6 mt-auto">
                    <div className="container mx-auto px-4">
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-4 mb-3">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                    HIPAA Compliant
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    End-to-End Encrypted
                                </div>
                            </div>
                            <p className="text-gray-600 text-sm">
                                © {new Date().getFullYear()} <span className="font-semibold text-blue-600">SPARD</span> — Smart Prescription Analyzer & Risk Detector
                            </p>
                            <p className="text-gray-500 text-xs mt-2 max-w-2xl mx-auto leading-relaxed">
                                This healthcare application is designed for prescription safety analysis and educational purposes only. 
                                Always consult qualified healthcare professionals for medical advice, diagnosis, and treatment decisions.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        );
    }

    // Main app for authenticated users
    return (
        <Router>
            <div className="min-h-screen bg-linear-to-br from-blue-50/20 via-white to-teal-50/20 font-sans flex flex-col">
                <Toaster 
                    position="top-center" 
                    reverseOrder={false}
                    toastOptions={{
                        duration: 4000,
                        style: {
                            borderRadius: '16px',
                            background: '#fff',
                            color: '#374151',
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                            border: '1px solid #e5e7eb',
                            padding: '16px 20px',
                            fontSize: '14px',
                            fontWeight: '500',
                        },
                        success: {
                            style: {
                                background: '#f0fdf4',
                                color: '#166534',
                                border: '1px solid #bbf7d0',
                            },
                        },
                        error: {
                            style: {
                                background: '#fef2f2',
                                color: '#dc2626',
                                border: '1px solid #fecaca',
                            },
                        },
                        loading: {
                            style: {
                                background: '#fffbeb',
                                color: '#d97706',
                                border: '1px solid #fed7aa',
                            },
                        },
                    }}
                />
                <Header />
                <main className="flex-1">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/analysis" element={<AnalysisPage />} />
                        <Route path="/analysis-report" element={<AnalysisPage />} />
                        <Route path="/recommendations" element={<RecommendationsPage />} />
                    </Routes>
                </main>
                <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200/50 py-6 mt-auto">
                    <div className="container mx-auto px-4">
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-6 mb-4">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                    HIPAA Compliant
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    End-to-End Encrypted
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    AI-Powered Analysis
                                </div>
                            </div>
                            <p className="text-gray-600 text-sm mb-2">
                                © {new Date().getFullYear()} <span className="font-semibold text-blue-600">SPARD</span> — Smart Prescription Analyzer & Risk Detector
                            </p>
                            <p className="text-gray-500 text-xs max-w-2xl mx-auto leading-relaxed">
                                This healthcare application provides AI-powered prescription safety analysis for educational and informational purposes. 
                                All medical decisions should be made in consultation with qualified healthcare professionals. 
                                Your health data is processed securely and confidentially.
                            </p>
                            <div className="mt-4 flex justify-center gap-6">
                                <button className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                                    Privacy Policy
                                </button>
                                <button className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                                    Terms of Service
                                </button>
                                <button className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                                    Medical Disclaimer
                                </button>
                                <button className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                                    Contact Support
                                </button>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </Router>
    );
}

export default App;