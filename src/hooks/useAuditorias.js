import { useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useAuditorias = () => {
  const [auditorias, setAuditorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAuditorias = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = await AsyncStorage.getItem('token');
      //const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzM0NjU2NzU2LCJleHAiOjE3MzQ2NjAzNTZ9.LeBLPArWw9pmlfcVgi2bwgO4C-uGMoiR0Mda-WY6WgY'
      console.log('Token JWT recuperado do AsyncStorage:', token);

      if (!token) {
        throw new Error('Token JWT não encontrado. Faça login novamente.');
      }

      const response = await axios.get('http://192.168.10.103:3000/auditoria/minha', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Dados recebidos da API:', response.data);
      setAuditorias(response.data.auditoria);
    } catch (err) {
      console.error('Erro ao buscar auditorias:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Erro ao buscar auditorias.');
    } finally {
      setLoading(false);
    }
  };

  

  useEffect(() => {
    fetchAuditorias();
  }, []);

  return { auditorias, loading, error };
};

export default useAuditorias;
