// src/hooks/useAuth.js
import { useState } from 'react';
import axios from 'axios';

const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('http://192.168.10.105:3000/usuarios', {
        username,
        password,
      });
      
      if (response.status === 200 && response.data.success) {
        // Store token or any necessary data
        return { success: true, data: response.data };
      } else {
        setError('Login failed. Please check your credentials.');
        return { success: false, error: 'Login failed' };
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
      return { success: false, error: 'An error occurred' };
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    loading,
    error,
  };
};

export default useAuth;
