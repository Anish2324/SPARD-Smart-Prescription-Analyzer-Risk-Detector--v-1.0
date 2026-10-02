import React, { useState, useEffect } from 'react';
import { PlusIcon, TrashIcon, PencilIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useStore } from '../store';
import API_BASE_URL from '../config/api';

const AllergyManager = () => {
    const { user, updateUser } = useStore();
    const [isEditing, setIsEditing] = useState(false);
    const [newAllergy, setNewAllergy] = useState('');
    const [allergies, setAllergies] = useState(user?.allergies || []);
    const [loading, setLoading] = useState(false);

    // Debug logging
    console.log('AllergyManager Debug:', {
        user: user,
        userAllergies: user?.allergies,
        localAllergies: allergies,
        userExists: !!user,
        userId: user?._id || user?.id
    });

    // Fetch user profile data on component mount to ensure allergies are up-to-date
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem('prescription-safety-token');
                if (!token || !user?._id) return;

                const response = await fetch(`${API_BASE_URL}/api/profile`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const profileData = await response.json();
                    const userAllergies = profileData.allergies || [];
                    console.log('✅ Profile fetched successfully:', {
                        profileData,
                        userAllergies,
                    });
                    setAllergies(userAllergies);
                    
                    // Update the user object in the store with fresh data
                    updateUser({ allergies: userAllergies });
                } else {
                    console.error('❌ Profile fetch failed:', response.status, await response.text());
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };

        fetchUserProfile();
    }, [user?._id, updateUser]);

    // Update local state when user object changes
    useEffect(() => {
        setAllergies(user?.allergies || []);
    }, [user?.allergies]);

    const handleAddAllergy = () => {
        if (!newAllergy.trim()) {
            toast.error('Please enter an allergy');
            return;
        }

        const allergyToAdd = newAllergy.trim().toLowerCase();
        
        // Check if allergy already exists
        if (allergies.some(allergy => allergy.toLowerCase() === allergyToAdd)) {
            toast.error('This allergy is already in your list');
            return;
        }

        const updatedAllergies = [...allergies, newAllergy.trim()];
        setAllergies(updatedAllergies);
        setNewAllergy('');
        toast.success('Allergy added successfully');
    };

    const handleRemoveAllergy = (indexToRemove) => {
        const updatedAllergies = allergies.filter((_, index) => index !== indexToRemove);
        setAllergies(updatedAllergies);
        toast.success('Allergy removed successfully');
    };

    const handleSaveChanges = async () => {
        setLoading(true);
        try {
            // Clean allergies before saving
            const cleanAllergies = allergies.filter(allergy => 
                allergy && 
                typeof allergy === 'string' && 
                allergy.trim() && 
                allergy.trim().toLowerCase() !== 'undefined' &&
                allergy.trim().toLowerCase() !== 'null'
            );
            
            console.log('💾 Saving allergies:', { original: allergies, cleaned: cleanAllergies });
            
            const token = localStorage.getItem('prescription-safety-token');
            
            const response = await fetch(`${API_BASE_URL}/api/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ allergies: cleanAllergies })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update profile');
            }

            const updatedUser = { ...user, allergies: cleanAllergies };
            updateUser(updatedUser);
            setAllergies(cleanAllergies);
            
            setIsEditing(false);
            toast.success('Allergies updated successfully');
            
            console.log('✅ Allergies saved to backend:', allergies);
        } catch (error) {
            console.error('Error updating allergies:', error);
            toast.error(`Failed to update allergies: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setAllergies(user?.allergies || []);
        setNewAllergy('');
        setIsEditing(false);
    };

    return (
        <div className="relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-linear-to-br from-red-50/50 via-white to-amber-50/30 rounded-3xl"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-100 rounded-full -translate-y-16 translate-x-16 opacity-40"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-100 rounded-full translate-y-12 -translate-x-12 opacity-40"></div>
            
            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-red-100/50">
                {/* Header Section */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="absolute inset-0 bg-linear-to-br from-red-500 to-amber-500 rounded-2xl transform rotate-6 scale-105 opacity-20"></div>
                            <div className="relative bg-white p-3 rounded-2xl shadow-lg border border-red-100">
                                <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold bg-linear-to-r from-red-600 to-amber-600 bg-clip-text text-transparent">
                                Medication Allergies
                            </h3>
                            <p className="text-gray-600 mt-1">Keep your allergy information current for safe prescription analysis</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                            isEditing 
                                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200' 
                                : 'bg-linear-to-r from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600 text-white shadow-lg hover:shadow-xl hover:scale-105'
                        }`}
                    >
                        <PencilIcon className="w-5 h-5" />
                        {isEditing ? 'Cancel' : 'Edit Allergies'}
                    </button>
                </div>

                {/* Current Allergies Section */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        <h4 className="text-lg font-semibold text-gray-800">Your Current Allergies</h4>
                        <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                            {allergies.length} recorded
                        </span>
                    </div>
                    
                    {allergies.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {allergies.map((allergy, index) => (
                                <div
                                    key={index}
                                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 ${
                                        isEditing 
                                            ? 'bg-red-50 border-red-200 hover:bg-red-100' 
                                            : 'bg-white border-red-100 shadow-sm'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                                        <span className="text-gray-800 font-medium capitalize">{allergy}</span>
                                    </div>
                                    {isEditing && (
                                        <button
                                            onClick={() => handleRemoveAllergy(index)}
                                            className="p-2 bg-white text-red-500 hover:bg-red-500 hover:text-white rounded-full border border-red-200 hover:border-red-500 transition-all duration-200 group/remove"
                                            title="Remove allergy"
                                        >
                                            <TrashIcon className="w-4 h-4 group-hover/remove:scale-110" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 bg-gray-50/80 rounded-2xl border border-gray-200">
                            <ExclamationTriangleIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-500 font-medium">No allergies recorded yet</p>
                            <p className="text-gray-400 text-sm mt-1">Add your medication allergies to ensure safe prescription analysis</p>
                        </div>
                    )}
                </div>

                {/* Add New Allergy Section */}
                {isEditing && (
                    <div className="border-t border-gray-200 pt-8 space-y-6">
                        {/* Add Allergy Input */}
                        <div className="bg-white rounded-2xl p-6 border border-blue-100 shadow-sm">
                            <h5 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <PlusIcon className="h-5 w-5 text-blue-500" />
                                Add New Allergy
                            </h5>
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    value={newAllergy}
                                    onChange={(e) => setNewAllergy(e.target.value)}
                                    placeholder="Enter medication allergy (e.g., penicillin, nsaid, sulfa)"
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg"
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddAllergy()}
                                />
                                <button
                                    onClick={handleAddAllergy}
                                    className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                                >
                                    <PlusIcon className="w-5 h-5" />
                                    Add
                                </button>
                            </div>
                        </div>

                        {/* Common Allergies Quick Add */}
                        <div className="bg-blue-50/80 rounded-2xl p-6 border border-blue-200">
                            <h5 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                Quick Add Common Allergies
                            </h5>
                            <div className="flex flex-wrap gap-2">
                                {['Penicillin', 'Macrolide', 'NSAID', 'Sulfa', 'Fluoroquinolone', 'Tetracycline', 'Opioid', 'Aspirin'].map((commonAllergy) => (
                                    <button
                                        key={commonAllergy}
                                        type="button"
                                        onClick={() => {
                                            if (!allergies.some(a => a.toLowerCase() === commonAllergy.toLowerCase())) {
                                                setAllergies([...allergies, commonAllergy]);
                                                toast.success(`${commonAllergy} allergy added`);
                                            } else {
                                                toast.info(`${commonAllergy} allergy already exists`);
                                            }
                                        }}
                                        className="px-4 py-2 bg-white hover:bg-blue-100 text-blue-700 rounded-xl border border-blue-200 transition-all duration-200 hover:scale-105 hover:shadow-md font-medium"
                                    >
                                        + {commonAllergy}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4">
                            <button
                                onClick={handleSaveChanges}
                                disabled={loading}
                                className="flex-1 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:shadow-inner"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                        Saving Changes...
                                    </div>
                                ) : (
                                    'Save Allergies'
                                )}
                            </button>
                            <button
                                onClick={handleCancel}
                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 border border-gray-300"
                            >
                                Discard Changes
                            </button>
                        </div>
                    </div>
                )}

                {/* Healthcare Information Section */}
                <div className="mt-8 bg-linear-to-r from-blue-50 to-teal-50 border border-blue-200 rounded-2xl p-6">
                    <div className="flex items-start gap-4">
                        <div className="bg-blue-100 p-3 rounded-2xl">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h5 className="font-bold text-blue-900 text-lg mb-3">Important Allergy Information</h5>
                            <div className="grid md:grid-cols-2 gap-4 text-blue-800">
                                <div className="space-y-2">
                                    <p className="font-semibold">Common Medication Classes:</p>
                                    <ul className="text-sm space-y-1">
                                        <li>• <strong>Penicillin:</strong> Amoxicillin, Ampicillin</li>
                                        <li>• <strong>Macrolide:</strong> Azithromycin, Erythromycin</li>
                                        <li>• <strong>NSAID:</strong> Ibuprofen, Aspirin, Naproxen</li>
                                    </ul>
                                </div>
                                <div className="space-y-2">
                                    <p className="font-semibold">Safety Benefits:</p>
                                    <ul className="text-sm space-y-1">
                                        <li>• Prevents dangerous drug interactions</li>
                                        <li>• Alerts for allergy conflicts in prescriptions</li>
                                        <li>• Personalized safety recommendations</li>
                                    </ul>
                                </div>
                            </div>
                            <p className="text-blue-700 text-sm mt-4 font-medium">
                                💡 Accurate allergy information helps our AI provide safer prescription analysis tailored to your health needs.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllergyManager;