import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const useAuditoriaDetails = () => {
  const [vendas, setVendas] = useState([]);
  const [fluxo, setFluxo] = useState([]);
  const [perdas, setPerdas] = useState([]);
  const [anotacoes, setAnotacoes] = useState([]);
  const [operacoes, setOperacoes] = useState([]);
  const [pausas, setPausas] = useState([]);
  const [formasPagamento, setFormasPagamento] = useState([]);
  const [sexos, setSexos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Função genérica para chamadas à API
  const handleApiRequest = async (url, method = 'GET', data = null) => {
    setLoading(true);
    setError(null);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Token não encontrado');

      const config = {
        method,
        url: `https://back-auditoria.onrender.com${url}`, // Base URL configurada
        headers: { Authorization: `Bearer ${token}` },
        ...(data && { data }),
      };

      const response = await axios(config);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Erro na requisição');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Funções de Vendas
  const cadastrarVenda = async (venda) => {
    const novaVenda = await handleApiRequest('/vendas', 'POST', venda);
    setVendas((prev) => [...prev, novaVenda]);
  };

  const fetchUltimasVendas = async () => {
    const ultimasVendas = await handleApiRequest('/vendas');
    setVendas(ultimasVendas);
  };

  // Funções de Fluxo
  const cadastrarFluxo = async (fluxoItem) => {
    const novoFluxo = await handleApiRequest('/avoperacional', 'POST', fluxoItem);
    setFluxo((prev) => [...prev, novoFluxo]);
  };

  const fetchFluxo = async () => {
    const fluxoData = await handleApiRequest('/avoperacional');
    setFluxo(fluxoData);
  };

  // Funções de Perdas
  const cadastrarPerda = async (perda) => {
    const novaPerda = await handleApiRequest('/perdas', 'POST', perda);
    setPerdas((prev) => [...prev, novaPerda]);
  };

  const fetchPerdas = async () => {
    const perdasData = await handleApiRequest('/perdas');
    setPerdas(perdasData);
  };

  // Funções de Anotações
  const cadastrarAnotacao = async (anotacao) => {
    const novaAnotacao = await handleApiRequest('/anotacao', 'POST', anotacao);
    setAnotacoes((prev) => [...prev, novaAnotacao]);
  };

  const fetchAnotacoes = async () => {
    const anotacoesData = await handleApiRequest('/anotacao');
    setAnotacoes(anotacoesData);
  };

  // Funções de Operações
  const cadastrarOperacao = async (operacao) => {
    const novaOperacao = await handleApiRequest('/cadavoperacional', 'POST', operacao);
    setOperacoes((prev) => [...prev, novaOperacao]);
  };

  const fetchOperacoes = async () => {
    const operacoesData = await handleApiRequest('/cadavoperacional');
    setOperacoes(operacoesData);
  };

  // Funções de Pausas
  const cadastrarPausa = async (pausa) => {
    const novaPausa = await handleApiRequest('/pausa', 'POST', pausa);
    setPausas((prev) => [...prev, novaPausa]);
  };

  const fetchPausas = async () => {
    const pausasData = await handleApiRequest('/pausa');
    setPausas(pausasData);
  };

  // Buscar Formas de Pagamento
  const fetchFormasPagamento = async () => {
    const formasData = await handleApiRequest('/formadepagamento');
    setFormasPagamento(formasData);
  };

  // Buscar Opções de Sexo
  const fetchSexos = async () => {
    const sexosData = await handleApiRequest('/cadsexo');
    setSexos(sexosData);
  };

  return {
    vendas,
    fluxo,
    perdas,
    anotacoes,
    operacoes,
    pausas,
    formasPagamento,
    sexos,
    cadastrarVenda,
    fetchUltimasVendas,
    cadastrarFluxo,
    fetchFluxo,
    cadastrarPerda,
    fetchPerdas,
    cadastrarAnotacao,
    fetchAnotacoes,
    cadastrarOperacao,
    fetchOperacoes,
    cadastrarPausa,
    fetchPausas,
    fetchFormasPagamento,
    fetchSexos,
    loading,
    error,
  };
};

export default useAuditoriaDetails;
