import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import useAuditoriaDetails from './useAuditoriaDetails';

const usePausa = (auditoriaId) => {
  const { fetchUltimasPausas, encerrarPausa, cadastrarPausa } = useAuditoriaDetails();
  const [pausaAtiva, setPausaAtiva] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedMotivoPausa, setSelectedMotivoPausa] = useState('');

  // 🔥 Verificar se há pausa ativa ao inicializar
  useEffect(() => {
    const verificarPausa = async () => {
      try {
        setLoading(true);
        const response = await fetchUltimasPausas(auditoriaId, 1, 1);

        if (response.pausas.length > 0 && response.pausas[0].status === 1) {
          setPausaAtiva(response.pausas[0]);
          setModalVisible(true);
        } else {
          setPausaAtiva(null);
          setModalVisible(false);
        }
      } catch (error) {
        console.error('❌ Erro ao verificar pausa ativa:', error);
      } finally {
        setLoading(false);
      }
    };

    verificarPausa();
  }, [auditoriaId]);

  // 🔥 Criar uma nova pausa e bloquear a interface
  const handleCadastrarPausa = async (selectedMotivoPausa) => {
    if (!selectedMotivoPausa) {
      return { error: 'Selecione um motivo para a pausa.' };
    }
  
    try {
      const pausa = {
        motivodepausaId: parseInt(selectedMotivoPausa, 10),
        auditoriaId: parseInt(auditoriaId, 10),
      };
  
      console.log("📡 Enviando nova pausa para API:", JSON.stringify(pausa, null, 2));
  
      // ✅ Certifique-se de que `cadastrarPausa` retorna os dados corretamente
      const novaPausa = await cadastrarPausa(pausa);
      
      if (!novaPausa) {
        throw new Error("A API não retornou os dados esperados");
      }
  
      console.log("✅ Nova pausa cadastrada:", novaPausa);
  
      setPausaAtiva(novaPausa);
      setModalVisible(true);
  
      return novaPausa; // 🔥 Retorna a pausa cadastrada corretamente
    } catch (err) {
      console.error('❌ Erro ao cadastrar pausa:', err);
      return { error: 'Não foi possível cadastrar a pausa.' };
    }
  };
  

  // 🔥 Encerrar a pausa e desbloquear a interface
  const handleEncerrarPausa = async () => {
    if (!pausaAtiva || !pausaAtiva.id) {
      Alert.alert('Erro', 'Nenhuma pausa ativa encontrada.');
      return;
    }

    try {
      console.log(`📡 Encerrando pausa com ID: ${pausaAtiva.id}`);
      await encerrarPausa(pausaAtiva.id);

      setPausaAtiva(null);
      setModalVisible(false);
      Alert.alert('Sucesso', 'Pausa encerrada com sucesso!');
    } catch (error) {
      console.error("❌ Erro ao encerrar pausa:", error);
      Alert.alert('Erro', 'Não foi possível encerrar a pausa.');
    }
  };

  return {
    pausaAtiva,
    modalVisible,
    loading,
    handleCadastrarPausa,
    handleEncerrarPausa,
    setModalVisible,
    selectedMotivoPausa,
    setSelectedMotivoPausa
  };
};

export default usePausa;
