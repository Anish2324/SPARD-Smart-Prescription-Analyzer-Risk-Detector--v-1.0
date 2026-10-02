import React from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import UploadSection from '../components/UploadSection';
import WelcomeSection from '../components/WelcomeSection';
import AllergyManager from '../components/AllergyManager';
import { useStore } from '../store';
import API_BASE_URL from '../config/api';

function HomePage() {
    const { setReport, setIsLoading, user } = useStore();
    const navigate = useNavigate();

    const handleAnalyze = async ({ prescription1, prescription2 }) => {
        if (!prescription1 || !prescription2) {
            toast.error('Please upload both prescriptions.');
            return;
        }

        setIsLoading(true);
        setReport(null);

        const formData = new FormData();
        formData.append('prescription1', prescription1);
        formData.append('prescription2', prescription2);
        formData.append('allergies', user?.allergies || '');

        const toastId = toast.loading('Analyzing prescriptions... This may take a moment.');

        try {
            // Get JWT token from localStorage
            const token = localStorage.getItem('prescription-safety-token');
            
            const response = await axios.post(`${API_BASE_URL}/api/analyze`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                },
            });
            
            setReport(response.data);
            toast.success('Analysis complete!', { id: toastId });
            // Redirect to analysis page
            navigate('/analysis');

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

    return (
        <div className="max-w-4xl mx-auto">
            <WelcomeSection />
            
            {/* Allergy Management Section */}
            <div className="mb-8">
                <AllergyManager />
            </div>
            
            <UploadSection onAnalyze={handleAnalyze} />
        </div>
    );
}

export default HomePage;