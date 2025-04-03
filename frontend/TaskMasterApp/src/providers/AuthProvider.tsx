import React, { useState, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { getToken, setToken, removeToken, getUser, setUser, removeUser } from '../utils/tokenStorage';
import { API_URL } from '../config';
import { User } from '../models/User';
import { RegisterRequest } from '../types/AuthContextType';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!getToken());
  const [user, setUserState] = useState<User | null>(
    getUser()
      ? {
          id: Number(getUser()?.id) || 0,
          email: getUser()?.email || "",
          username: getUser()?.username || "",
          first_name: getUser()?.first_name || "",
          last_name: getUser()?.last_name || "",
        }
      : null
  );
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Verify user authentication when page loads
  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();
      if (token) {
        try {
          const response = await fetch(`${API_URL}/auth/user/`, {
            headers: {
              'Authorization': `Token ${token}`
            }
          });
          
          if (response.ok) {
            const userData = await response.json();
            const user: User = {
              id: Number(userData.id),
              email: userData.email,
              username: userData.username,
              first_name: userData.first_name || "",
              last_name: userData.last_name || ""
            };
            
            setUserState(user);
            setUser(user);
            setIsAuthenticated(true);
          } else {
            // Invalid or expired token
            removeToken();
            removeUser();
            setIsAuthenticated(false);
            setUserState(null);
          }
        } catch (error) {
          console.error("Error verifying authentication:", error);
          removeToken();
          removeUser();
          setIsAuthenticated(false);
          setUserState(null);
        }
      }
    };
    
    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        const user: User = {
          id: Number(data.user.id),
          email: data.user.email,
          username: data.user.username,
          first_name: data.user.first_name || "",
          last_name: data.user.last_name || ""
        };

        setToken(data.token);
        setUser(user);
        setUserState(user);
        setIsAuthenticated(true);
      } else {
        setError(data.non_field_errors?.[0] || 'Error initiating session. Try again.');
      }
    } catch (error) {
      setError('Connection error. Please try again.');
      console.error("Login Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/auth/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        const user: User = {
          id: Number(data.user.id),
          email: data.user.email,
          username: data.user.username,
          first_name: data.user.first_name || "",
          last_name: data.user.last_name || ""
        };

        setToken(data.token);
        setUser(user);
        setUserState(user);
        setIsAuthenticated(true);
      } else {
        // Mejor manejo de diferentes tipos de errores
        if (data.username) {
          setError(Array.isArray(data.username) ? data.username[0] : data.username);
        } else if (data.email) {
          setError(Array.isArray(data.email) ? data.email[0] : data.email);
        } else if (data.password) {
          setError(Array.isArray(data.password) ? data.password[0] : data.password);
        } else if (data.non_field_errors) {
          setError(Array.isArray(data.non_field_errors) ? data.non_field_errors[0] : data.non_field_errors);
        } else {
          // Fallback general para cualquier otro tipo de error
          const errorMessage = Object.values(data).flat().join(' ');
          setError(errorMessage || 'An unexpected error occurred');
        }
      }
    } catch (error) {
      setError('Connection error. Please try again.');
      console.error("Registry Error", error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    
    try {
      const token = getToken();
      if (token) {
        await fetch(`${API_URL}/auth/logout/`, {
          method: 'POST',
          headers: {
            'Authorization': `Token ${token}`
          }
        });
      }
    } catch (error) {
      console.error("Error closing session:", error);
    } finally {
      removeToken();
      removeUser();
      setIsAuthenticated(false);
      setUserState(null);
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        error,
        login,
        register,
        logout,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;