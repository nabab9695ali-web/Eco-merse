import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('ecom_token');
      if (token) {
        try {
          const res = await apiRequest('/auth/profile');
          if (res.success) {
            setUser(res.user);
          } else {
            localStorage.removeItem('ecom_token');
            setUser(null);
          }
        } catch (error) {
          console.error('Failed to authenticate with saved token', error);
          localStorage.removeItem('ecom_token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (res.success && res.user.token) {
      localStorage.setItem('ecom_token', res.user.token);
      setUser(res.user);
      return res.user;
    }
    throw new Error(res.message || 'Login failed');
  };

  const register = async (name, email, password, phone) => {
    const res = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, phone }),
    });

    if (res.success && res.user.token) {
      localStorage.setItem('ecom_token', res.user.token);
      setUser(res.user);
      return res.user;
    }
    throw new Error(res.message || 'Registration failed');
  };

  const updateProfile = async (userData) => {
    const res = await apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });

    if (res.success) {
      if (res.user.token) {
        localStorage.setItem('ecom_token', res.user.token);
      }
      setUser(res.user);
      return res.user;
    }
    throw new Error(res.message || 'Update profile failed');
  };

  const logout = () => {
    localStorage.removeItem('ecom_token');
    setUser(null);
  };

  const isAdmin = user && user.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        updateProfile,
        logout,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
