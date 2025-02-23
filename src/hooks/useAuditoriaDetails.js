import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const useAuditoriaDetails = () => {
  const [vendas, setVendas] = useState([]);
  const [fluxo, setFluxo] = useState([]);

  const [perdas, setPerdas] = useState([]);
  const [motivoperdas, setMotivoperdas] = useState([]);

  const [avaliacao, setAvaliacao] = useState([]);
  const [perguntas, setPerguntas] = useState([]);
  
  const [anotacoes, setAnotacoes] = useState([]);
  const [operacoes, setOperacoes] = useState([]);
  const [motivopausa, setMotivopausa] = useState([]);
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

  const checkAuthentication = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Sessão expirada', 'Por favor, faça login novamente.');
        navigation.navigate('Login');
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
  
  const fetchUltimasVendas = async (auditoriaId, page = 1, limit = 10) => {
    try {
      const response = await handleApiRequest(`/vendas?auditoriaId=${auditoriaId}&page=${page}&limit=${limit}`);
      
      console.log("📡 Vendas recebidas:", response);
  
      if (response && response.vendas) {
        return {
          vendas: response.vendas
            .map(venda => ({
              ...venda,
              faixaEtaria: venda.faixaEtaria || 'adulto',
              sexo: venda.sexo || { id: '', name: 'Desconhecido' },
              formadepagamento: venda.formadepagamento || { id: '', name: 'Não informado' }
            }))
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)), // 🔥 Ordena do mais recente para o mais antigo
  
          totalPages: response.totalPages,
          totalItems: response.totalItems,
          currentPage: response.currentPage,
        };
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
    const novoFluxo = await handleApiRequest('/fluxo', 'POST', fluxoItem);
    setFluxo((prev) => [...prev, novoFluxo]);
  };

  const fetchFluxo = async (auditoriaId) => {
    try {
        console.log(`📡 Chamando API: /fluxo?auditoriaId=${auditoriaId}`);

        const response = await handleApiRequest(`/fluxo?auditoriaId=${auditoriaId}`);

        if (!response || !response.fluxopessoa || !Array.isArray(response.fluxopessoa)) {
            console.warn("⚠️ Resposta inesperada da API. Nenhum fluxo encontrado.");
            return [];
        }

        console.log("✅ Fluxo recebido:", response.fluxopessoa);
        return response.fluxopessoa; // Garante que sempre retorna um array
    } catch (error) {
        console.error('❌ Erro ao buscar fluxo:', error.message);
        return [];
    }
};

const atualizarFluxo = async (fluxoId, dadosAtualizados) => {
  try {
      console.log(`📡 Enviando PUT para /fluxo/${fluxoId} com dados:`, JSON.stringify(dadosAtualizados, null, 2));

      const response = await handleApiRequest(`/fluxo/${fluxoId}`, 'PUT', dadosAtualizados);

      console.log('✅ Fluxo atualizado com sucesso:', response);
      return response;
  } catch (error) {
      console.error('❌ Erro ao atualizar fluxo:', error);
      throw error;
  }
};

 // Funções de Avalicao
 const cadastrarAvaliacao = async (novaAvaliacao) => {
  try {
    if (!novaAvaliacao || !novaAvaliacao.perguntaID) {
      throw new Error('❌ Dados inválidos para cadastro da avaliação.');
    }

    console.log('📡 Enviando nova avaliação para API:', JSON.stringify(novaAvaliacao, null, 2));

    const response = await handleApiRequest('/avoperacional', 'POST', novaAvaliacao);

    console.log('✅ Nova avaliação cadastrada:', response);

    setAvaliacao((prev) => [...prev, response]);

    return response;
  } catch (error) {
    console.error('❌ Erro ao cadastrar avaliação:', error.response ? error.response.data : error.message);
    setError(error.message);
    throw error;
  }
};

const excluirAvaliacao = async (idAvaliacao) => {
  try {
    await handleApiRequest(`/avoperacional/${idAvaliacao}`, 'DELETE');
    setAvaliacao((prev) => prev.filter((avaliacao) => avaliacao.id !== idAvaliacao));
    console.log('✅ Avaliação excluída com sucesso!');
  } catch (err) {
    console.error('❌ Erro ao excluir avaliação:', err);
    setError(err.message);
    throw err;
  }
};


const fetchAvaliacao = async () => {
  try {
    setLoading(true);
    const response = await handleApiRequest('/avoperacional');
    setAvaliacao(response.avaliacao || []);
  } catch (error) {
    console.error('❌ Erro ao buscar avaliações:', error);
    setError(error.message);
  } finally {
    setLoading(false);
  }
};


const fetchUltimasAvaliacoes = async (auditoriaId, page = 1, limit = 10) => {
  try {
    const response = await handleApiRequest(`/avoperacional?auditoriaId=${auditoriaId}&page=${page}&limit=${limit}`);

    console.log("📡 Avaliações recebidas:", response);

    if (response && response.avaliacao) {
      return {
        avaliacoes: response.avaliacao.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
        totalPages: response.totalPages,
        totalItems: response.totalItems,
        currentPage: response.currentPage,
      };
    } else {
      throw new Error('❌ Nenhuma avaliação encontrada.');
    }
  } catch (error) {
    console.error('❌ Erro ao buscar últimas avaliações:', error.message);
    setError(error.message);
    throw error;
  }
};


const fetchPerguntasAvaliacao = async () => {
  setLoading(true);
  try {
    const response = await handleApiRequest('/cadavoperacional');
    
    console.log('📡 Dados de perguntas recebidos:', response);

    // 🔥 Certifica-se de acessar corretamente a chave correta na API
    if (response && response.cadavoperacional && Array.isArray(response.cadavoperacional)) {
      // 🔥 Filtra apenas perguntas onde `situacao === true`
      const perguntasAtivas = response.cadavoperacional.filter(pergunta => pergunta.situacao === true);
      
      console.log("✅ Perguntas ativas carregadas:", perguntasAtivas);
      
      setPerguntas(perguntasAtivas);
    } else {
      console.log("⚠️ Nenhuma pergunta disponível");
      setPerguntas([]);
    }
  } catch (error) {
    console.error('❌ Erro ao buscar perguntas de avaliação operacional:', error);
    setError(error.message);
  } finally {
    setLoading(false);
  }
};


const atualizarAvaliacao = async (avaliacaoAtualizada) => {
  try {
    setLoading(true);

    if (!avaliacaoAtualizada.id) {
      throw new Error("❌ ID da avaliação é obrigatório para atualizar.");
    }

    console.log(`📡 Atualizando avaliação com ID: ${avaliacaoAtualizada.id}`, avaliacaoAtualizada);

    const response = await handleApiRequest(`/avoperacional/${avaliacaoAtualizada.id}`, 'PUT', avaliacaoAtualizada);

    setAvaliacao((prevAvaliacoes) =>
      prevAvaliacoes.map((a) => (a.id === avaliacaoAtualizada.id ? response : a))
    );

    console.log('✅ Avaliação operacional atualizada na API:', response);

    return response;
  } catch (err) {
    console.error("❌ Erro ao atualizar avaliação operacional:", err);
    setError(err.message);
    throw err;
  } finally {
    setLoading(false);
  }
};

  
  
  // Funções de Perdas
  const cadastrarPerda = async (perda) => {
    try {
      if (!perda || !perda.motivoperdasId || !perda.obs) {
        throw new Error('Dados inválidos para cadastro da perda.');
      }
  
      console.log('📡 Enviando nova perda para API:', JSON.stringify(perda, null, 2));
  
      const novaPerda = await handleApiRequest('/perdas', 'POST', perda);
      console.log('✅ Nova perda cadastrada:', novaPerda);
  
      setPerdas((prev) => [...prev, novaPerda]); // Atualiza o estado com a nova perda
    } catch (error) {
      console.error('❌ Erro ao cadastrar perda:', error.message);
      throw new Error('Erro ao cadastrar a perda.');
    }
  };

  const excluirPerda = async (idPerda) => {
    try {
      // Requisição para excluir a venda usando o método DELETE
      await handleApiRequest(`/perdas/${idPerda}`, 'DELETE');
      
      // Atualiza o estado local, removendo a venda pelo ID
      setPerdas((prev) => prev.filter((perda) => perda.id !== idPerda));
      
      console.log('Perda excluída com sucesso!');
    } catch (err) {
      console.error('Erro ao excluir perda:', err); // Log de erro
      throw err; // Opcional: Propagar o erro para tratamento adicional
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

  const fetchUltimasPerdas = async (auditoriaId, page = 1, limit = 10) => {
    try {
      const response = await handleApiRequest(
        `/perdas?auditoriaId=${auditoriaId}&page=${page}&limit=${limit}`
      );
  
      console.log("📡 Perdas recebidas:", response);
  
      if (response && response.perdas) {
        return {
          perdas: response.perdas
            .map(perda => ({
              ...perda,
              motivoPerda: perda.motivoperdas || { id: '', name: 'Desconhecido' }, 
              observacao: perda.obs || 'Sem observação',
            }))
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)), // 🔥 Ordenação do mais recente para o mais antigo
  
          totalPages: response.totalPages, 
          totalItems: response.totalItems,
          currentPage: response.currentPage,
        };
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

  const atualizarPerda = async (perda) => {
    try {
      if (!perda.id) {
        throw new Error("ID da perda é obrigatório para atualizar.");
      }
  
      console.log(`📡 Enviando requisição PUT para /perdas/${perda.id}`, JSON.stringify(perda, null, 2));
  
      const perdaAtualizada = await handleApiRequest(`/perdas/${perda.id}`, 'PUT', perda);
  
      console.log('✅ Perda atualizada na API:', perdaAtualizada);
  
      setPerdas((prevPerdas) =>
        prevPerdas.map((v) => (v.id === perda.id ? perdaAtualizada : v))
      );
  
      return perdaAtualizada;
    } catch (err) {
      console.error("❌ Erro ao atualizar perda:", err);
      throw err;
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


  const fetchUltimasAnotacoes = async (auditoriaId, page = 1, limit = 10) => {
    try {
        console.log(`📡 Buscando anotações para auditoria ID: ${auditoriaId}, página ${page}`);

        const response = await handleApiRequest(
          `/anotacao?auditoriaId=${Number(auditoriaId)}&page=${Number(page)}&limit=${Number(limit)}`
        );
        

        console.log("📥 Dados recebidos da API:", response);

        if (response && response.anotacoes) {
            return {
                anotacoes: response.anotacoes,
                totalPages: response.totalPages || 1,
                totalItems: response.totalItems || response.anotacoes.length,
                currentPage: response.currentPage || page,
            };
        } else {
            console.warn("⚠️ Nenhuma anotação encontrada na API.");
            return { anotacoes: [], totalPages: 1, totalItems: 0, currentPage: page };
        }
    } catch (error) {
        console.error("❌ Erro ao buscar anotações:", error);
        throw error;
    }
};

  const excluirAnotacao = async (anotacaoId) => {
    try {
      // Requisição para excluir a venda usando o método DELETE
      await handleApiRequest(`/anotacao/${anotacaoId}`, 'DELETE');
      
      // Atualiza o estado local, removendo a venda pelo ID
      setAnotacoes((prev) => prev.filter((anotacao) => anotacao.id !== anotacaoId));
      
      console.log('Anotação excluída com sucesso!');
    } catch (err) {
      console.error('Erro ao Anotação perda:', err); // Log de erro
      throw err; // Opcional: Propagar o erro para tratamento adicional
    }
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
  const fetchPausas = async () => {
    const pausasData = await handleApiRequest('/pausa');
    setPausas(pausasData);
  };

  const cadastrarPausa = async (pausa) => {
    try {
      if (!pausa || !pausa.motivodepausaId) {
        throw new Error('Dados inválidos para cadastro da pausa.');
      }
  
      console.log('📡 Enviando nova pausa para API:', JSON.stringify(pausa, null, 2));
  
      // ✅ Verifica se a API realmente retorna os dados da nova pausa
      const novaPausa = await handleApiRequest('/pausa', 'POST', pausa);
  
      if (!novaPausa || !novaPausa.id) {
        throw new Error("A API não retornou a nova pausa corretamente");
      }
  
      console.log('✅ Nova pausa cadastrada:', novaPausa);
  
      setPausas((prev) => [...prev, novaPausa]); // Atualiza o estado com a nova pausa
  
      return novaPausa; // ✅ Agora sempre retorna os dados corretos
    } catch (error) {
      console.error('❌ Erro ao cadastrar pausa:', error.message);
      throw new Error('Erro ao cadastrar a pausa.');
    }
  };

  const fetchMotivoPausa = async () => {
  setLoading(true);
  try {
    const motivopausaData = await handleApiRequest('/motivodepausa');
    console.log('Dados de pausa:', motivopausaData);

    if (motivopausaData.motivodepausa && Array.isArray(motivopausaData.motivodepausa)) {
      // Filtra apenas os itens que tenham situacao === true
      const dadosFiltrados = motivopausaData.motivodepausa.filter(
        (item) => item.situacao === true
      );

      // Caso queira normalizar chaves ou usar do jeito que já vem
      // Exemplo de normalização (opcional):
      // const dadosNormalizados = dadosFiltrados.map((item) => ({
      //   id: item.id,
      //   name: item.name,
      //   situacao: item.situacao,
      //   createdAt: item.createdAt,
      //   updatedAt: item.updatedAt,
      // }));

      // Seta o estado apenas com os itens filtrados
      console.log('Dados de teste:',dadosFiltrados)
      setMotivopausa(dadosFiltrados);
    } else {
      
      setMotivopausa([]);
    }
  } catch (error) {
    console.error('Erro ao buscar pausa:', error);
  } finally {
    setLoading(false);
  }
};

const fetchUltimasPausas = async (auditoriaId, page = 1, limit = 10) => {
  try {
    console.time("⏳ Tempo de resposta da API - fetchUltimasPausas");

    const response = await handleApiRequest(
      `/pausa?auditoriaId=${auditoriaId}&page=${page}&limit=${limit}`
    );

    console.timeEnd("⏳ Tempo de resposta da API - fetchUltimasPausas");

    if (response?.pausas) {
      return {
        pausas: response.pausas.map(pausa => {
          const createdAt = new Date(pausa.createdAt);
          const updatedAt = new Date(pausa.updatedAt || new Date());

          // 🔥 Diferencial otimizado
          const diffMs = Math.max(updatedAt - createdAt, 0);
          const diffSeconds = Math.floor(diffMs / 1000);
          const diffMinutes = Math.floor(diffSeconds / 60);
          const diffHours = Math.floor(diffMinutes / 60);

          const tempoGasto = `${diffHours > 0 ? `${diffHours}h ` : ""}${diffMinutes % 60}min ${diffSeconds % 60}s`;

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
    } else {
      throw new Error('Dados de pausas não encontrados.');
    }
  } catch (error) {
    console.error('❌ Erro ao buscar pausas:', error.message);
    throw error;
  }
};

const verificarPausaAtiva = async (auditoriaId) => {
  if (!auditoriaId) {
    console.warn("⚠️ Nenhuma auditoriaId fornecida. Pulando verificação de pausa.");
    return null;
  }

  try {
    console.log(`📡 Buscando pausa ativa para auditoriaId: ${auditoriaId}`);

    const response = await handleApiRequest(`/pausa/ativas/${auditoriaId}`);

    if (response?.pausas?.length > 0) {
      console.log("✅ Pausa ativa encontrada:", response.pausas[0]);
      return {
        ...response.pausas[0],
        motivodepausa: response.pausas[0].motivodepausa || { id: '', name: 'Desconhecido' },
      };
    } else {
      console.log("✅ Nenhuma pausa ativa encontrada.");
      return null;
    }
  } catch (error) {
    console.error('❌ Erro ao verificar pausa ativa:', error);
    return null;
  }
};

const excluirPausa = async (IdPausa) => {
  try {
    // Requisição para excluir a venda usando o método DELETE
    await handleApiRequest(`/pausa/${IdPausa}`, 'DELETE');
    
    // Atualiza o estado local, removendo a venda pelo ID
    setPausas((prev) => prev.filter((pausa) => pausa.id !== IdPausa));
    
    console.log('Pausa excluída com sucesso!');
  } catch (err) {
    console.error('Erro ao excluir Pausa:', err); // Log de erro
    throw err; // Opcional: Propagar o erro para tratamento adicional
  }
};

const encerrarPausa = async (pausaId, updateData = {}) => {
  try {
    if (!pausaId) {
      throw new Error("ID da pausa é obrigatório para encerrar.");
    }

    console.log(`📡 Enviando requisição para encerrar a pausa com ID: ${pausaId}`);

    // 🔥 Envia a requisição **alterando apenas o `status`**
    const response = await handleApiRequest(`/pausa/${pausaId}`, "PUT", { status: 0, ...updateData });

    console.log("✅ Pausa encerrada e atualizada na API:", response);

    return response;
  } catch (error) {
    console.error("❌ Erro ao encerrar pausa:", error);
    throw new Error("Erro ao encerrar pausa.");
  }
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
    motivopausa,
    perguntas,
    avaliacao,
    encerrarPausa,
    excluirAnotacao,
    atualizarFluxo,
    atualizarPerda,
    atualizarVenda,
    excluirVenda,
    excluirPerda,
    excluirPausa,
    cadastrarVenda,
    fetchUltimasVendas,
    fetchUltimasPerdas,
    fetchUltimasPausas,
    cadastrarFluxo,
    fetchFluxo,
    cadastrarPerda,
    fetchPerdas,
    cadastrarAnotacao,
    fetchUltimasAnotacoes,
    fetchAnotacoes,
    cadastrarOperacao,
    fetchOperacoes,
    cadastrarPausa,
    fetchPausas,
    fetchMotivoPausa,
    fetchFormasPagamento,
    fetchSexos,
    fetchMotivoPerdas,
    checkAuthentication,
    verificarPausaAtiva,
    cadastrarAvaliacao,
    excluirAvaliacao,
    fetchAvaliacao,
    fetchUltimasAvaliacoes,
    fetchPerguntasAvaliacao,
    atualizarAvaliacao,
    loading,
    error,
  };
};

export default useAuditoriaDetails;
