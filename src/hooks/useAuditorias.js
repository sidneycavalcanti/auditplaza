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
      if (!token) {
        throw new Error('Token JWT não encontrado. Por favor, faça login novamente.');
      }

      const response = await axios.get('http://192.168.10.103:3000/auditoria/minha', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAuditorias(response.data.auditoria);
    } catch (err) {
      console.error('Erro ao buscar auditorias:', err.response || err);
      setError(err.response?.data?.error || 'Erro ao buscar auditorias.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditorias();
  }, []);

  return { auditorias, loading, error, fetchAuditorias }; // Retorna a função fetchAuditorias
};

export default useAuditorias;
