import { useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useAuditorias = () => {
  const [auditorias, setAuditorias] = useState([]); // Lista de auditorias
  const [loading, setLoading] = useState(false); // Estado de carregamento
  const [error, setError] = useState(null); // Erro, se houver

  // Função para buscar as auditorias
  const fetchAuditorias = async () => {
    setLoading(true);
    setError(null);

    try {
      // Obtenha o token de autenticação
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('Token JWT não encontrado. Por favor, faça login novamente.');
      }

      // Faça a requisição para o backend
      const response = await axios.get('https://back-auditoria.onrender.com/auditoria/minha', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Verifique se a resposta contém os dados esperados
      if (response.data && response.data.auditoria) {
        setAuditorias(response.data.auditoria); // Atualize o estado com os dados da auditoria
      } else {
        throw new Error('Resposta da API não contém o campo esperado "auditoria".');
      }
    } catch (err) {
      console.error('Erro ao buscar auditorias:', err.response || err);
      setError(err.response?.data?.error || 'Erro ao buscar auditorias.');
    } finally {
      setLoading(false);
    }
  };

  // Busque auditorias ao montar o componente
  useEffect(() => {
    fetchAuditorias();
  }, []);

  // Retorne os dados e a função fetchAuditorias
  return { auditorias, loading, error, fetchAuditorias };
};

export default useAuditorias;
