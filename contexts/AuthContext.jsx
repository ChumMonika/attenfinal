'use client';

import { createContext, useContext, useState, useEffect } from 'react';

// 1. Create the context
const AuthContext = createContext(null);

// 2. Create the provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // We're keeping the isLoading state from your file. It's a great idea!
  const [isLoading, setIsLoading] = useState(true);

  // We're using this from your file to check if a user session exists in localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);


  // IMPORTANT: The login function is simple now. It just receives user data.
  // The LoginForm component will handle the API call.
  const login = (userData) => {
    setUser(userData);
    // We'll also store the user in localStorage to keep them logged in
    localStorage.setItem('currentUser', JSON.stringify(userData));
  };

  // The logout function now also clears localStorage
  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    // Optionally, redirect to login page
    // window.location.href = '/'; 
  };

  const value = { user, login, logout, isLoading };

  return (
    <AuthContext.Provider value={value}>
      {/* We wait until we've checked localStorage before rendering the app */}
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

// 3. Create a custom hook for easy access
export const useAuth = () => {
  return useContext(AuthContext);
};