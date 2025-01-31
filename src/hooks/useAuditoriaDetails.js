import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const useAuditoriaDetails = () => {
  const [vendas, setVendas] = useState([]);
  const [fluxo, setFluxo] = useState([]);
  const [perdas, setPerdas] = useState([]);
  const [motivoperdas, setMotivoperdas] = useState([]);
  const [anotacoes, setAnotacoes] = useState([]);
  const [operacoes, setOperacoes] = useState([]);
  const [pausas, setPausas] = useState([]);
  const [formasPagamento, setFormasPagamento] = useState([]);
  const [sexos, setSexos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  // Função genérica para chamadas à API
  const handleApiRequest = async (url, method = 'GET', data = null, additionalHeaders = {}) => {
    setLoading(true);
    setError(null);
  
    try {
      // Recuperar o token de autenticação
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Token não encontrado');
  
      // Configuração da requisição
      const config = {
        method,
        url: `https://back-auditoria.onrender.com${url}`, // Base URL
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json', // Definir JSON como padrão
          ...additionalHeaders, // Headers adicionais, se necessários
        },
        ...(data && { data }), // Adiciona o corpo da requisição apenas se existir
      };
  
      console.log(`Chamando API: ${config.method} ${config.url}`, config); // Log útil para debug
  
      // Realizar a requisição
      const response = await axios(config);
  
      console.log('Resposta da API:', response.data); // Log de debug
      return response.data;
    } catch (err) {
      // Capturar e tratar o erro
      const errorMessage = err.response?.data?.message || 'Erro na requisição';
      console.error('Erro na API:', errorMessage, err); // Log detalhado do erro
      setError(errorMessage);
      throw new Error(errorMessage); // Repassar o erro para o chamador
    } finally {
      setLoading(false); // Sempre desabilitar o estado de carregamento
    }
  };
  

  // Funções de Vendas
  const cadastrarVenda = async (venda) => {
    try {
      const novaVenda = await handleApiRequest('/vendas', 'POST', venda); // Envia a venda
      setVendas((prev) => [...prev, novaVenda]); // Atualiza o estado local
    } catch (err) {
      console.error('Erro ao cadastrar venda:', err); // Log de erro
      throw err;
    }
  };
  
  const fetchUltimasVendas = async (auditoriaId) => {
    try {
      const response = await handleApiRequest(`/vendas?auditoriaId=${auditoriaId}`);
  
      console.log("📡 Vendas recebidas:", response);
  
      if (response && response.vendas) {
        setVendas(response.vendas.map(venda => ({
          ...venda,
          faixaEtaria: venda.faixaEtaria || 'adulto', // 🔥 Garante que sempre tenha um valor correto
          sexo: venda.sexo || { id: '', name: 'Desconhecido' }, // 🔥 Evita undefined
          formadepagamento: venda.formadepagamento || { id: '', name: 'Não informado' } // 🔥 Evita undefined
        })));
        return response.vendas;
      } else {
        throw new Error('Dados de vendas não encontrados.');
      }
    } catch (error) {
      console.error("❌ Erro ao buscar vendas:", error);
      throw error;
    }
  };
  

const atualizarVenda = async (venda) => {
  try {
    if (!venda.id) {
      throw new Error("ID da venda é obrigatório para atualizar.");
    }

    console.log(`📡 Enviando requisição PUT para /vendas/${venda.id}`, JSON.stringify(venda, null, 2));

    const vendaAtualizada = await handleApiRequest(`/vendas/${venda.id}`, 'PUT', venda);

    console.log('✅ Venda atualizada na API:', vendaAtualizada);

    setVendas((prevVendas) =>
      prevVendas.map((v) => (v.id === venda.id ? vendaAtualizada : v))
    );

    return vendaAtualizada;
  } catch (err) {
    console.error("❌ Erro ao atualizar venda:", err);
    throw err;
  }
};

  

  const excluirVenda = async (idVenda) => {
    try {
      // Requisição para excluir a venda usando o método DELETE
      await handleApiRequest(`/vendas/${idVenda}`, 'DELETE');
      
      // Atualiza o estado local, removendo a venda pelo ID
      setVendas((prev) => prev.filter((venda) => venda.id !== idVenda));
      
      console.log('Venda excluída com sucesso!');
    } catch (err) {
      console.error('Erro ao excluir venda:', err); // Log de erro
      throw err; // Opcional: Propagar o erro para tratamento adicional
    }
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
  const cadastrarPerda = async () => {
    try {
      if (!perda || !perda.motivo || !perda.descricao) {
        throw new Error('Dados inválidos para cadastro da perda.');
      }
  
      const novaPerda = await handleApiRequest('/perdas', 'POST', perda);
      console.log('Nova perda cadastrada:', novaPerda);
  
      setPerdas((prev) => [...prev, novaPerda]); // Atualiza o estado com a nova perda
    } catch (error) {
      console.error('Erro ao cadastrar perda:', error.message);
      throw new Error('Erro ao cadastrar a perda.');
    }
  };
  

  const fetchPerdas = async () => {
    setLoading(true); // Ativa o estado de carregamento antes da chamada específica
    try {
      const perdasData = await handleApiRequest('/perdas');
      console.log('Dados de perdas:', perdasData); // Verificar estrutura
  
      if (perdasData.perdas && Array.isArray(perdasData.perdas)) {
        setPerdas(perdasData.perdas); // Caso seja um array direto
      } else {
        setPerdas([]); // Caso a estrutura seja inesperada
      }
    } catch (error) {
      console.error('Erro ao buscar perdas:', error);
    } finally {
      setLoading(false); // Desativa o estado de carregamento
    }
  };

  const fetchUltimasPerdas = async (auditoriaId) => {
    try {
      const response = await handleApiRequest(`/perdas?auditoriaId=${auditoriaId}`);
      
      // Verifique se 'vendas' existe na resposta
      if (response && response.perdas) {
        setPerdas(response.perdas); // Atualiza o estado
        return response.perdas; // Retorna a lista de vendas
      } else {
        throw new Error('Dados de perdas não encontrados.');
      }
    } catch (error) {
      console.error('Erro ao buscar perdas:', error.message);
      throw error;
    }
  };

  const fetchMotivoPerdas = async () => {
    setLoading(true); // Ativa o estado de carregamento antes da chamada específica
    try {
      const motivoperdasData = await handleApiRequest('/motivoperdas');
      console.log('Dados de perdas:', motivoperdasData); // Verificar estrutura
  
      if (motivoperdasData.motivoperdas && Array.isArray(motivoperdasData.motivoperdas)) {
        setMotivoperdas(motivoperdasData.motivoperdas); // Caso seja um array direto
      } else {
        setMotivoperdas([]); // Caso a estrutura seja inesperada
      }
    } catch (error) {
      console.error('Erro ao buscar perdas:', error);
    } finally {
      setLoading(false); // Desativa o estado de carregamento
    }
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
    setLoading(true); // Ativa o estado de carregamento antes da chamada específica
    try {
      const response = await handleApiRequest('/formadepagamento'); // Chama a API
      if (response.formadepagamento && Array.isArray(response.formadepagamento)) {
        setFormasPagamento(response.formadepagamento); // Atualiza o estado com os dados da API
      } else {
        setFormasPagamento([]); // Caso o retorno não seja o esperado
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Erro ao buscar formas de pagamento');
    } finally {
      setLoading(false); // Desativa o estado de carregamento
    }
  };

  // Buscar Opções de Sexo
  const fetchSexos = async () => {
    setLoading(true); // Ativa o estado de carregamento antes da chamada específica
    try {
      const response = await handleApiRequest('/cadsexo'); // Chama a API
      if (response.cadsexo && Array.isArray(response.cadsexo)) {
        setSexos(response.cadsexo); // Atualiza o estado com os dados da API
      } else {
        setSexos([]); // Caso o retorno não seja o esperado
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Erro ao buscar sexos');
    } finally {
      setLoading(false); // Desativa o estado de carregamento
    }
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
    motivoperdas,
    atualizarVenda,
    excluirVenda,
    cadastrarVenda,
    fetchUltimasVendas,
    fetchUltimasPerdas,
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
    fetchMotivoPerdas,
    loading,
    error,
  };
};

export default useAuditoriaDetails;
