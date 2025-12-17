import React, { createContext, useContext, useState, useEffect } from 'react';

// ============================================================================
// AUTH CONTEXT
// ============================================================================
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('apeer_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('apeer_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (email) => {
    let role = 'student';
    if (email.includes('teacher')) role = 'teacher';
    if (email.includes('admin')) role = 'admin';
    
    const userData = { email, role, name: email.split('@')[0] };
    setUser(userData);
    localStorage.setItem('apeer_user', JSON.stringify(userData));
  };

  const register = (email, name, role) => {
    // Mock registration - in real app, this would call backend
    const userData = { email, role, name };
    setUser(userData);
    localStorage.setItem('apeer_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('apeer_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

