import React, { useState } from 'react';
import { PlusIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useStore } from '../store';

const AllergyManager = () => {
    const { user, updateUser } = useStore();
    const [isEditing, setIsEditing] = useState(false);
    const [newAllergy, setNewAllergy] = useState('');
    const [allergies, setAllergies] = useState(user?.allergies || []);

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
        try {
            // Update user object with new allergies
            const updatedUser = { ...user, allergies };
            updateUser(updatedUser);
            
            // Here you could also make an API call to update the backend
            // await updateUserAllergies(user.id, allergies);
            
            setIsEditing(false);
            toast.success('Allergies updated successfully');
        } catch (error) {
            toast.error('Failed to update allergies');
        }
    };

    const handleCancel = () => {
        setAllergies(user?.allergies || []);
        setNewAllergy('');
        setIsEditing(false);
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <div className="bg-gradient-to-br from-red-500 to-pink-600 w-10 h-10 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">Manage Allergies</h3>
                        <p className="text-slate-600 text-sm">Keep your allergy information up to date</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
                >
                    <PencilIcon className="w-4 h-4 mr-2" />
                    {isEditing ? 'Cancel Edit' : 'Edit Allergies'}
                </button>
            </div>

            {/* Current Allergies Display */}
            <div className="mb-6">
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Current Allergies:</h4>
                {allergies.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {allergies.map((allergy, index) => (
                            <div
                                key={index}
                                className="flex items-center bg-red-50 border border-red-200 rounded-full px-3 py-1"
                            >
                                <span className="text-red-800 text-sm font-medium">{allergy}</span>
                                {isEditing && (
                                    <button
                                        onClick={() => handleRemoveAllergy(index)}
                                        className="ml-2 text-red-600 hover:text-red-800 transition-colors"
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-slate-500 italic">No allergies recorded</p>
                )}
            </div>

            {/* Add New Allergy Form */}
            {isEditing && (
                <div className="border-t border-slate-200 pt-6">
                    <div className="flex gap-3 mb-4">
                        <input
                            type="text"
                            value={newAllergy}
                            onChange={(e) => setNewAllergy(e.target.value)}
                            placeholder="Enter new allergy (e.g., penicillin, macrolide, nsaid, sulfa)"
                            className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            onKeyPress={(e) => e.key === 'Enter' && handleAddAllergy()}
                        />
                        <button
                            onClick={handleAddAllergy}
                            className="flex items-center px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                        >
                            <PlusIcon className="w-5 h-5 mr-1" />
                            Add
                        </button>
                    </div>

                    {/* Common Allergies Quick Add */}
                    <div className="mb-4">
                        <p className="text-sm font-medium text-slate-600 mb-2">Quick add common allergies:</p>
                        <div className="flex flex-wrap gap-2">
                            {['penicillin', 'macrolide', 'nsaid', 'sulfa', 'fluoroquinolone', 'tetracycline', 'opioid'].map((commonAllergy) => (
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
                                    className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-full border border-blue-200 transition-colors"
                                >
                                    + {commonAllergy}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={handleSaveChanges}
                            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
                        >
                            Save Changes
                        </button>
                        <button
                            onClick={handleCancel}
                            className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 py-3 px-4 rounded-lg font-semibold transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Information Note */}
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-sm">
                        <p className="text-blue-800 font-medium mb-2">Important Allergy Types:</p>
                        <ul className="text-blue-700 space-y-1">
                            <li><strong>Penicillin:</strong> Includes amoxicillin, ampicillin</li>
                            <li><strong>Macrolide:</strong> Includes azithromycin, clarithromycin, erythromycin</li>
                            <li><strong>NSAID:</strong> Includes ibuprofen, aspirin, naproxen</li>
                            <li><strong>Sulfa:</strong> Includes sulfonamide antibiotics</li>
                            <li><strong>Fluoroquinolone:</strong> Includes ciprofloxacin, levofloxacin</li>
                        </ul>
                        <p className="text-blue-700 mt-2">
                            Keep your allergy information accurate for safe prescription analysis.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllergyManager;