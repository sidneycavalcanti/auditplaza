import { useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (username, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('https://back-auditoria.onrender.com/auth/signin', {
        username,
        password,
      });

      
    
      if (response.status === 200 && response.data.token) {
        //console.log('Token recebido no login:', response.data.token);

        await AsyncStorage.setItem('token', response.data.token);

        const storedToken = await AsyncStorage.getItem('token');
       // console.log('Token armazenado no AsyncStorage:', storedToken);

        
      } else {
        setError('Login falhou. Verifique suas credenciais.');
        return { success: false, error: 'Login falhou' };
      }

      return { success: true, data: response.data };

    } catch (err) {
      console.error('Erro ao fazer login:', err);
      setError('Usuário ou senha incorretos. Tente novamente.');
      return { 
        //success: false, error: 'Usuário ou senha incorretos. Tente novamente.'
         };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('Removendo token do AsyncStorage...');
      await AsyncStorage.removeItem('token');
      console.log('Token removido com sucesso.');
      return { success: true };
    } catch (err) {
      console.error('Erro ao fazer logout:', err);
      return { success: false, error: 'Falha ao fazer logout' };
    }
  };

  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log('Token recuperado:', token);
      return token;
    } catch (err) {
      console.error('Erro ao recuperar o token:', err);
      return null;
    }
  };

  const validateToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.log('Token não encontrado no AsyncStorage.');
        return false;
      }
      console.log('Token válido encontrado:', token);
      return true;
    } catch (err) {
      console.error('Erro ao validar o token:', err);
      return false;
    }
  };

  return {
    login,
    logout,
    getToken,
    validateToken,
    loading,
    error,
  };
};

export default useAuth;
