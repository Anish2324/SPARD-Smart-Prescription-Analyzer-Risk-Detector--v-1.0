import { create } from 'zustand';
import API_BASE_URL from './config/api';

export const useStore = create((set, get) => ({
    // Prescription analysis state
    report: null,
    isLoading: false,
    setReport: (report) => set({ report }),
    setIsLoading: (isLoading) => set({ isLoading }),
    
    // Authentication state - Load from localStorage on init
    user: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('prescription-safety-user') || 'null') : null,
    isAuthenticated: typeof window !== 'undefined' ? !!localStorage.getItem('prescription-safety-user') : false,
    
    // Authentication actions
    login: async (email, password) => {
        try {
            // Call Flask backend API
            const response = await fetch(`${API_BASE_URL}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });
            
            const result = await response.json();
            
            if (response.ok && result.success) {
                // Set current user
                const userData = result.user;
                set({ 
                    user: userData, 
                    isAuthenticated: true 
                });
                localStorage.setItem('prescription-safety-user', JSON.stringify(userData));
                localStorage.setItem('prescription-safety-token', result.token);
                
                return { success: true, user: userData };
            } else {
                return { success: false, error: result.error || result.message || 'Login failed' };
            }
            
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: 'Login failed. Please try again.' };
        }
    },
    
    register: async (userData) => {
        try {
            // Call Flask backend API
            const response = await fetch(`${API_BASE_URL}/api/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });
            
            const result = await response.json();
            
            if (response.ok && result.success) {
                // Set current user
                const newUser = result.user;
                set({ 
                    user: newUser, 
                    isAuthenticated: true 
                });
                localStorage.setItem('prescription-safety-user', JSON.stringify(newUser));
                localStorage.setItem('prescription-safety-token', result.token);
                
                // Set flag to indicate user just registered
                sessionStorage.setItem('userJustRegistered', 'true');
                
                return { success: true, user: newUser };
            } else {
                return { success: false, error: result.error || result.message || 'Registration failed' };
            }
            
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, error: 'Registration failed. Please try again.' };
        }
    },
    
    updateUser: (updatedUserData) => {
        const currentUser = get().user;
        if (!currentUser) return;
        
        const updatedUser = { ...currentUser, ...updatedUserData };
        
        // Update current user in store
        set({ user: updatedUser });
        localStorage.setItem('prescription-safety-user', JSON.stringify(updatedUser));
        
        // Update user in the users array as well
        const existingUsers = JSON.parse(localStorage.getItem('prescription-safety-users') || '[]');
        const userIndex = existingUsers.findIndex(u => u.id === updatedUser.id);
        
        if (userIndex !== -1) {
            // Preserve password while updating other fields
            existingUsers[userIndex] = { 
                ...existingUsers[userIndex], 
                ...updatedUser 
            };
            localStorage.setItem('prescription-safety-users', JSON.stringify(existingUsers));
        }
    },

    logout: () => {
        set({ 
            user: null, 
            isAuthenticated: false,
            report: null  // Clear report on logout
        });
        if (typeof window !== 'undefined') {
            localStorage.removeItem('prescription-safety-user');
        }
    },
}));
