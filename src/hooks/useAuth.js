// src/hooks/useAuth.js
import { useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Instale se ainda não estiver instalado: npm install @react-native-async-storage/async-storage

const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (username, password) => {
    setLoading(true);
    setError(null);

    try {
      // Enviar requisição para o endpoint de login
      const response = await axios.post('http://192.168.10.103:3000/auth/signin', {
        username,
        password,
      });

      if (response.status === 200 && response.data.token) {
        // Armazenar o token JWT no AsyncStorage
        await AsyncStorage.setItem('token', response.data.token);

        // Retornar sucesso com os dados do usuário
        return { success: true, data: response.data };
      } else {
        setError('Login failed. Please check your credentials.');
        return { success: false, error: 'Login failed' };
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred during login. Please try again.');
      return { success: false, error: 'An error occurred' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Remover o token JWT do AsyncStorage
      await AsyncStorage.removeItem('token');
      return { success: true };
    } catch (err) {
      console.error('Logout error:', err);
      return { success: false, error: 'Logout failed' };
    }
  };

  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      return token;
    } catch (err) {
      console.error('Error retrieving token:', err);
      return null;
    }
  };

  return {
    login,
    logout,
    getToken,
    loading,
    error,
  };
};

export default useAuth;
