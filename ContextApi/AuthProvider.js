import React, { useState, useEffect } from 'react';
import AuthContext from './AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  const loadToken = async () => {
    try {
      const storedToken =await AsyncStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
      }
    } catch (error) {
      console.error('Error loading token:', error.message);
    }
  };

  useEffect(() => {
    loadToken();
  }, []);

  const login = (newToken) => {
    AsyncStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logout = () => {
      AsyncStorage.removeItem('token');
      setToken(null)
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
