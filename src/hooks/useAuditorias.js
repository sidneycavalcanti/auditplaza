// src/hooks/useAuditorias.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const useAuditorias = () => {
  const [auditorias, setAuditorias] = useState([]);

  useEffect(() => {
    const fetchAuditorias = async () => {
      try {
        const response = await axios.get('http://192.168.10.109:3000/auditoria');
        setAuditorias(response.data.auditoria);
      } catch (error) {
        console.error('Erro ao buscar auditorias:', error);
      }
    };
    fetchAuditorias();
  }, []);

  return auditorias;
};

export default useAuditorias;
