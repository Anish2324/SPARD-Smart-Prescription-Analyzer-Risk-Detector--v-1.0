import { create } from 'zustand';

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
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // Get users from local storage
            const existingUsers = JSON.parse(localStorage.getItem('prescription-safety-users') || '[]');
            const user = existingUsers.find(u => u.email === email && u.password === password);
            
            if (!user) {
                return { success: false, error: 'Invalid email or password' };
            }
            
            // Create user object without password
            const userData = {
                id: user.id,
                name: user.name,
                email: user.email,
                age: user.age,
                gender: user.gender,
                allergies: user.allergies || []
            };
            
            // Set current user
            set({ 
                user: userData, 
                isAuthenticated: true 
            });
            localStorage.setItem('prescription-safety-user', JSON.stringify(userData));
            
            return { success: true, user: userData };
            
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: 'Login failed. Please try again.' };
        }
    },
    
    register: async (userData) => {
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Check if user already exists locally
            const existingUsers = JSON.parse(localStorage.getItem('prescription-safety-users') || '[]');
            const userExists = existingUsers.find(user => user.email === userData.email);
            
            if (userExists) {
                return { success: false, error: 'User with this email already exists' };
            }
            
            // Create new user with ID
            const newUser = {
                id: Date.now().toString(),
                name: userData.name,
                email: userData.email,
                age: userData.age,
                gender: userData.gender,
                allergies: userData.allergies || [],
                createdAt: new Date().toISOString()
            };
            
            // Save to local storage
            existingUsers.push({ ...newUser, password: userData.password }); // Store password for login
            localStorage.setItem('prescription-safety-users', JSON.stringify(existingUsers));
            
            // Set current user
            set({ 
                user: newUser, 
                isAuthenticated: true 
            });
            localStorage.setItem('prescription-safety-user', JSON.stringify(newUser));
            
            return { success: true, user: newUser };
            
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
