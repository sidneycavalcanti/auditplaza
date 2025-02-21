import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import useAuditoriaDetails from './useAuditoriaDetails';

const usePausa = (auditoriaId) => {
  const { encerrarPausa, cadastrarPausa, verificarPausaAtiva } = useAuditoriaDetails();
  const [pausaAtiva, setPausaAtiva] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedMotivoPausa, setSelectedMotivoPausa] = useState('');

  // 🔥 Verifica se existe uma pausa ativa ao carregar a auditoria
  useEffect(() => {
    const checkPausa = async () => {
      if (!auditoriaId) return;

      setLoading(true);
      try {
        const pausa = await verificarPausaAtiva(auditoriaId);

        if (pausa) {
          setPausaAtiva(pausa);
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

    checkPausa();
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

        const novaPausa = await cadastrarPausa(pausa, auditoriaId, setPausaAtiva, setModalVisible);

        if (!novaPausa) {
            throw new Error("A API não retornou os dados esperados");
        }

        console.log("✅ Nova pausa cadastrada:", novaPausa);

        return novaPausa;
    } catch (err) {
        console.error('❌ Erro ao cadastrar pausa:', err);
        return { error: 'Não foi possível cadastrar a pausa.' };
    }
};


  // 🔥 Encerrar a pausa (muda status para 0)
  const handleEncerrarPausa = async () => {
    if (!pausaAtiva?.id) {
      Alert.alert('Erro', 'Nenhuma pausa ativa encontrada.');
      return { error: 'Nenhuma pausa ativa encontrada.' };
    }

    try {
      console.log(`📡 Encerrando pausa com ID: ${pausaAtiva.id}`);
      await encerrarPausa(pausaAtiva.id, { status: 0 });

      setPausaAtiva(null);
      setModalVisible(false);

      //Alert.alert('Sucesso', 'Pausa encerrada com sucesso.');
      return { success: true };
    } catch (error) {
      console.error("❌ Erro ao encerrar pausa:", error);
      Alert.alert('Erro', 'Não foi possível encerrar a pausa.');
      return { error: 'Não foi possível encerrar a pausa.' };
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
