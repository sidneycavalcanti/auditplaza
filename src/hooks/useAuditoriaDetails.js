import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const useAuditoriaDetails = () => {
  const [vendas, setVendas] = useState([]);
  const [fluxo, setFluxo] = useState([]);
  const [perdas, setPerdas] = useState([]);
  const [motivoperdas, setMotivoperdas] = useState([]);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [cadAvaliacao, setCadAvaliacao] = useState([]);
  const [perguntas, setPerguntas] = useState([]);
  const [anotacoes, setAnotacoes] = useState([]);
  const [operacoes, setOperacoes] = useState([]);
  const [motivopausa, setMotivopausa] = useState([]);
  const [pausas, setPausas] = useState([]);
  const [formasPagamento, setFormasPagamento] = useState([]);
  const [sexos, setSexos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --------------------------------------
  // Função genérica para chamadas à API
  // --------------------------------------
  const handleApiRequest = async (url, method = 'GET', data = null, additionalHeaders = {}) => {
    setLoading(true);
    setError(null);
  
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Token não encontrado');
  
      const config = {
        method,
        url: `https://back-auditoria.onrender.com${url}`,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          ...additionalHeaders,
        },
        // Somente anexa 'data' se existir e não for GET
        ...(data && method !== 'GET' ? { data } : {}),
      };
  
      // Requisição via axios
      const response = await axios(config);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erro na requisição';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  

  // --------------------------------------
  // Verificar se há token no AsyncStorage
  // --------------------------------------
  const checkAuthentication = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      Alert.alert('Sessão expirada', 'Por favor, faça login novamente.');
      navigation.navigate('Login');
    }
  };

  // --------------------------------------
  // Vendas
  // --------------------------------------
  const cadastrarVenda = async (venda) => {
    const novaVenda = await handleApiRequest('/vendas', 'POST', venda);
    setVendas((prev) => [...prev, novaVenda]);
  };

  const fetchUltimasVendas = async (auditoriaId, page = 1, limit = 10) => {
    const response = await handleApiRequest(
      `/vendas?auditoriaId=${auditoriaId}&page=${page}&limit=${limit}`
    );
    if (response?.vendas) {
      return {
        vendas: response.vendas
          .map((venda) => ({
            ...venda,
            faixaEtaria: venda.faixaEtaria || 'adulto',
            sexo: venda.sexo || { id: '', name: 'Desconhecido' },
            formadepagamento: venda.formadepagamento || { id: '', name: 'Não informado' },
          }))
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
        totalPages: response.totalPages,
        totalItems: response.totalItems,
        currentPage: response.currentPage,
      };
    }
    throw new Error('Dados de vendas não encontrados.');
  };

  const atualizarVenda = async (venda) => {
    if (!venda.id) throw new Error("ID da venda é obrigatório para atualizar.");
    const vendaAtualizada = await handleApiRequest(`/vendas/${venda.id}`, 'PUT', venda);
    setVendas((prevVendas) => prevVendas.map((v) => (v.id === venda.id ? vendaAtualizada : v)));
    return vendaAtualizada;
  };

  const excluirVenda = async (idVenda) => {
    await handleApiRequest(`/vendas/${idVenda}`, 'DELETE');
    setVendas((prev) => prev.filter((venda) => venda.id !== idVenda));
  };

  // --------------------------------------
  // Fluxo
  // --------------------------------------
  const cadastrarFluxo = async (fluxoItem) => {
    const novoFluxo = await handleApiRequest('/fluxo', 'POST', fluxoItem);
    setFluxo((prev) => [...prev, novoFluxo]);
  };

  const fetchFluxo = async (auditoriaId) => {
    const response = await handleApiRequest(`/fluxo?auditoriaId=${auditoriaId}`);
    if (response?.fluxopessoa && Array.isArray(response.fluxopessoa)) {
      return response.fluxopessoa;
    }
    return [];
  };

  const atualizarFluxo = async (fluxoId, dadosAtualizados) => {
    return await handleApiRequest(`/fluxo/${fluxoId}`, 'PUT', dadosAtualizados);
  };

  // --------------------------------------
  // Avaliações
  // --------------------------------------
  const cadastrarAvaliacao = async (novaAvaliacao) => {
    if (!novaAvaliacao?.cadavoperacionalId) {
      throw new Error('Dados inválidos para cadastro da avaliação (cadavoperacionalId ausente).');
    }
    const response = await handleApiRequest('/avoperacional', 'POST', novaAvaliacao);
    setAvaliacoes((prev) => [...prev, response]);
    return response;
  };

  const excluirAvaliacao = async (idAvaliacao) => {
    await handleApiRequest(`/avoperacional/${idAvaliacao}`, 'DELETE');
    setAvaliacoes((prev) => prev.filter((avaliacao) => avaliacao.id !== idAvaliacao));
  };

  const fetchAvaliacao = async () => {
    setLoading(true);
    try {
      const response = await handleApiRequest('/avoperacional');
      setAvaliacoes(response.avaliacao || []);
    } finally {
      setLoading(false);
    }
  };

  const fetchUltimasAvaliacoes = async (auditoriaId, page = 1, limit = 10) => {
    const response = await handleApiRequest(
      `/avoperacional?auditoriaId=${auditoriaId}&page=${page}&limit=${limit}`
    );
    if (response?.avaliacoes && Array.isArray(response.avaliacoes)) {
      return {
        avaliacoes: response.avaliacoes.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        ),
        totalPages: response.totalPages || 1,
        totalItems: response.totalItems || response.avaliacoes.length,
        currentPage: response.currentPage || page,
      };
    }
    if (response?.id) {
      return {
        avaliacoes: [response].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
        totalPages: 1,
        totalItems: 1,
        currentPage: 1,
      };
    }
    throw new Error('Dados de avaliações não encontrados.');
  };

  const fetchCadAvaliacao = async () => {
    setLoading(true);
    try {
      const response = await handleApiRequest('/cadavoperacional');
      if (response?.cadavoperacional && Array.isArray(response.cadavoperacional)) {
        const avaliacaoAtivas = response.cadavoperacional.filter((p) => p.situacao === true);
        setCadAvaliacao(avaliacaoAtivas);
      } else {
        setCadAvaliacao([]);
      }
    } finally {
      setLoading(false);
    }
  };

// Exemplo de função no hook useAuditoriaDetails.js
const fetchPerguntasAvaliacao = async (avaliacaoId) => {
  setLoading(true);
  try {
    // Passa o ID como query param na URL
    const response = await handleApiRequest(
      `/cadquestoes?cadavoperacionalId=${avaliacaoId}`,
      'GET'
    );
    if (response?.cadquestoes && Array.isArray(response.cadquestoes)) {
      const perguntasAtivas = response.cadquestoes.filter((p) => p.situacao === true);
      setPerguntas(perguntasAtivas);
    } else {
      setPerguntas([]);
    }
  } finally {
    setLoading(false);
  }
};


  const atualizarAvaliacao = async (avaliacaoAtualizada) => {
    if (!avaliacaoAtualizada.id) {
      throw new Error('ID da avaliação é obrigatório para atualizar.');
    }
    const response = await handleApiRequest(
      `/avoperacional/${avaliacaoAtualizada.id}`,
      'PUT',
      avaliacaoAtualizada
    );
    setAvaliacoes((prev) => prev.map((a) => (a.id === avaliacaoAtualizada.id ? response : a)));
    return response;
  };

  // --------------------------------------
  // Perdas
  // --------------------------------------
  const cadastrarPerda = async (perda) => {
    if (!perda?.motivoperdasId || !perda?.obs) {
      throw new Error('Dados inválidos para cadastro da perda.');
    }
    const novaPerda = await handleApiRequest('/perdas', 'POST', perda);
    setPerdas((prev) => [...prev, novaPerda]);
  };

  const excluirPerda = async (idPerda) => {
    await handleApiRequest(`/perdas/${idPerda}`, 'DELETE');
    setPerdas((prev) => prev.filter((perda) => perda.id !== idPerda));
  };

  const fetchPerdas = async () => {
    setLoading(true);
    try {
      const perdasData = await handleApiRequest('/perdas');
      if (perdasData?.perdas && Array.isArray(perdasData.perdas)) {
        setPerdas(perdasData.perdas);
      } else {
        setPerdas([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUltimasPerdas = async (auditoriaId, page = 1, limit = 10) => {
    const response = await handleApiRequest(
      `/perdas?auditoriaId=${auditoriaId}&page=${page}&limit=${limit}`
    );
    if (response?.perdas) {
      return {
        perdas: response.perdas
          .map((perda) => ({
            ...perda,
            motivoPerda: perda.motivoperdas || { id: '', name: 'Desconhecido' },
            observacao: perda.obs || 'Sem observação',
          }))
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
        totalPages: response.totalPages,
        totalItems: response.totalItems,
        currentPage: response.currentPage,
      };
    }
    throw new Error('Dados de perdas não encontrados.');
  };

  const fetchMotivoPerdas = async () => {
    setLoading(true);
    try {
      const motivoperdasData = await handleApiRequest('/motivoperdas');
      if (motivoperdasData?.motivoperdas && Array.isArray(motivoperdasData.motivoperdas)) {
        setMotivoperdas(motivoperdasData.motivoperdas);
      } else {
        setMotivoperdas([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const atualizarPerda = async (perda) => {
    if (!perda.id) throw new Error('ID da perda é obrigatório para atualizar.');
    const perdaAtualizada = await handleApiRequest(`/perdas/${perda.id}`, 'PUT', perda);
    setPerdas((prev) => prev.map((v) => (v.id === perda.id ? perdaAtualizada : v)));
    return perdaAtualizada;
  };

  // --------------------------------------
  // Anotações
  // --------------------------------------
  const cadastrarAnotacao = async (anotacao) => {
    const novaAnotacao = await handleApiRequest('/anotacao', 'POST', anotacao);
    setAnotacoes((prev) => [...prev, novaAnotacao]);
  };

  const fetchAnotacoes = async () => {
    const anotacoesData = await handleApiRequest('/anotacao');
    setAnotacoes(anotacoesData);
  };

  const fetchUltimasAnotacoes = async (auditoriaId, page = 1, limit = 10) => {
    const response = await handleApiRequest(
      `/anotacao?auditoriaId=${auditoriaId}&page=${page}&limit=${limit}`
    );
    if (response?.anotacoes) {
      return {
        anotacoes: response.anotacoes,
        totalPages: response.totalPages || 1,
        totalItems: response.totalItems || response.anotacoes.length,
        currentPage: response.currentPage || page,
      };
    }
    return { anotacoes: [], totalPages: 1, totalItems: 0, currentPage: page };
  };

  const excluirAnotacao = async (anotacaoId) => {
    await handleApiRequest(`/anotacao/${anotacaoId}`, 'DELETE');
    setAnotacoes((prev) => prev.filter((anotacao) => anotacao.id !== anotacaoId));
  };

  // --------------------------------------
  // Operações
  // --------------------------------------
  const cadastrarOperacao = async (operacao) => {
    const novaOperacao = await handleApiRequest('/cadavoperacional', 'POST', operacao);
    setOperacoes((prev) => [...prev, novaOperacao]);
  };

  const fetchOperacoes = async () => {
    const operacoesData = await handleApiRequest('/cadavoperacional');
    setOperacoes(operacoesData);
  };

  // --------------------------------------
  // Pausas
  // --------------------------------------
  const fetchPausas = async () => {
    const pausasData = await handleApiRequest('/pausa');
    setPausas(pausasData);
  };

  const cadastrarPausa = async (pausa, auditoriaId, setPausaAtiva, setModalVisible) => {
    if (!pausa?.motivodepausaId) {
      throw new Error('Dados inválidos para cadastro da pausa.');
    }
    const novaPausa = await handleApiRequest('/pausa', 'POST', pausa);
    if (!novaPausa?.id) throw new Error('A API não retornou a nova pausa corretamente');
    setPausas((prev) => [...prev, novaPausa]);

    // Verifica se há pausa ativa
    const pausaAtivaAtualizada = await verificarPausaAtiva(auditoriaId);
    if (pausaAtivaAtualizada) {
      setPausaAtiva(pausaAtivaAtualizada);
      setModalVisible(true);
    }
    return novaPausa;
  };

  const fetchMotivoPausa = async () => {
    setLoading(true);
    try {
      const motivopausaData = await handleApiRequest('/motivodepausa');
      if (motivopausaData?.motivodepausa && Array.isArray(motivopausaData.motivodepausa)) {
        const dadosFiltrados = motivopausaData.motivodepausa.filter((item) => item.situacao === true);
        setMotivopausa(dadosFiltrados);
      } else {
        setMotivopausa([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUltimasPausas = async (auditoriaId, page = 1, limit = 10) => {
    const response = await handleApiRequest(
      `/pausa?auditoriaId=${auditoriaId}&page=${page}&limit=${limit}`
    );
    if (response?.pausas) {
      return {
        pausas: response.pausas.map((pausa) => {
          const createdAt = new Date(pausa.createdAt);
          const updatedAt = new Date(pausa.updatedAt || new Date());
          const diffMs = Math.max(updatedAt - createdAt, 0);
          const diffSeconds = Math.floor(diffMs / 1000);
          const diffMinutes = Math.floor(diffSeconds / 60);
          const diffHours = Math.floor(diffMinutes / 60);
          const tempoGasto = `${diffHours > 0 ? `${diffHours}h ` : ''}${diffMinutes % 60}min ${
            diffSeconds % 60
          }s`;
          return {
            ...pausa,
            motivodepausa: pausa.motivodepausa || { id: '', name: 'Desconhecido' },
            tempoGasto,
          };
        }),
        totalPages: response.totalPages,
        totalItems: response.totalItems,
        currentPage: response.currentPage,
      };
    }
    throw new Error('Dados de pausas não encontrados.');
  };

  const verificarPausaAtiva = async (auditoriaId) => {
    if (!auditoriaId) return null;
    const response = await handleApiRequest(`/pausa/ativas/${auditoriaId}`);
    if (response?.pausas?.length > 0) {
      return {
        ...response.pausas[0],
        motivodepausa: response.pausas[0].motivodepausa || { id: '', name: 'Desconhecido' },
      };
    }
    return null;
  };

  const excluirPausa = async (IdPausa) => {
    await handleApiRequest(`/pausa/${IdPausa}`, 'DELETE');
    setPausas((prev) => prev.filter((pausa) => pausa.id !== IdPausa));
  };

  const encerrarPausa = async (pausaId, updateData = {}) => {
    if (!pausaId) throw new Error('ID da pausa é obrigatório para encerrar.');
    return await handleApiRequest(`/pausa/${pausaId}`, 'PUT', { status: 0, ...updateData });
  };

  // --------------------------------------
  // Formas de Pagamento
  // --------------------------------------
  const fetchFormasPagamento = async () => {
    setLoading(true);
    try {
      const response = await handleApiRequest('/formadepagamento');
      if (response?.formadepagamento && Array.isArray(response.formadepagamento)) {
        setFormasPagamento(response.formadepagamento);
      } else {
        setFormasPagamento([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------
  // Sexos
  // --------------------------------------
  const fetchSexos = async () => {
    setLoading(true);
    try {
      const response = await handleApiRequest('/cadsexo');
      if (response?.cadsexo && Array.isArray(response.cadsexo)) {
        setSexos(response.cadsexo);
      } else {
        setSexos([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------
  // Retorno
  // --------------------------------------
  return {
    // Estados
    vendas,
    fluxo,
    perdas,
    anotacoes,
    operacoes,
    pausas,
    formasPagamento,
    cadAvaliacao,
    sexos,
    motivoperdas,
    motivopausa,
    perguntas,
    avaliacoes,
    loading,
    error,

    // Funções
    checkAuthentication,

    cadastrarVenda,
    fetchUltimasVendas,
    atualizarVenda,
    excluirVenda,

    cadastrarFluxo,
    fetchFluxo,
    atualizarFluxo,

    cadastrarAvaliacao,
    excluirAvaliacao,
    fetchAvaliacao,
    fetchUltimasAvaliacoes,
    fetchPerguntasAvaliacao,
    atualizarAvaliacao,
    fetchCadAvaliacao,

    cadastrarPerda,
    excluirPerda,
    fetchPerdas,
    fetchUltimasPerdas,
    fetchMotivoPerdas,
    atualizarPerda,

    cadastrarAnotacao,
    excluirAnotacao,
    fetchAnotacoes,
    fetchUltimasAnotacoes,

    cadastrarOperacao,
    fetchOperacoes,

    cadastrarPausa,
    fetchPausas,
    fetchMotivoPausa,
    fetchUltimasPausas,
    verificarPausaAtiva,
    excluirPausa,
    encerrarPausa,

    fetchFormasPagamento,
    fetchSexos,
  };
};

export default useAuditoriaDetails;
