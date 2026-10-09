import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('nananail_token') || sessionStorage.getItem('nananail_token'));
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyStoredToken = async () => {
      const storedToken = localStorage.getItem('nananail_token') || sessionStorage.getItem('nananail_token');
      if (storedToken) {
        try {
          const res = await apiClient.get('/me');
          setUser(res.data.user);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Session expired or invalid:', error);
          logout();
        }
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    };

    verifyStoredToken();
  }, []);

  const login = async (username, password, rememberMe = true) => {
    try {
      const res = await apiClient.post('/login', { username, password });
      const { token, user } = res.data;
      
      if (rememberMe) {
        localStorage.setItem('nananail_token', token);
      } else {
        sessionStorage.setItem('nananail_token', token);
      }

      setToken(token);
      setUser(user);
      setIsAuthenticated(true);
      navigate('/admin');
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      setIsAuthenticated(false);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('nananail_token');
    sessionStorage.removeItem('nananail_token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);