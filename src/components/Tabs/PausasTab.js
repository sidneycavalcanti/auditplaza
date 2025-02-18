import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import styles from '../../styles/AuditoriaScreenStyles';
import useAuditoriaDetails from '../../hooks/useAuditoriaDetails';

const PausasTab = ({ auditoriaId, setActiveTab }) => {
  const {
    cadastrarPausa,
    fetchMotivoPausa,
    encerrarPausa,
    motivopausa,
    loading,
    error
  } = useAuditoriaDetails();

  // Declaração de estados
  const [selectedMotivoPausa, setSelectedMotivoPausa] = useState('');
  const [pausaAtiva, setPausaAtiva] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Busca os motivos de pausa ao montar o componente
  useEffect(() => {
    fetchMotivoPausa();
  }, []);

  // Criar uma nova pausa e bloquear a interface
  const handleCadPausa = async () => {
    if (!selectedMotivoPausa) {
      Alert.alert('Erro', 'Selecione um motivo para a pausa.');
      return;
    }
  
    try {
      const pausa = {
        motivodepausaId: parseInt(selectedMotivoPausa, 10),
        auditoriaId: parseInt(auditoriaId, 10)
      };
  
      console.log("📡 Enviando nova pausa para API:", JSON.stringify(pausa, null, 2));

      const novaPausa = await cadastrarPausa(pausa);
  
      console.log("✅ Nova pausa cadastrada:", novaPausa);

      setPausaAtiva(novaPausa); // 🔥 Aqui o estado é atualizado
      console.log("🔥 Estado atualizado: ", pausaAtiva);
  
      setModalVisible(true); // 🔥 Abre o modal
  
      // Limpa os campos após o cadastro
      setSelectedMotivoPausa('');
    } catch (err) {
      console.error('❌ Erro ao cadastrar pausa:', err);
      Alert.alert('Erro', 'Não foi possível cadastrar a pausa.');
    }
  };
  

  // Encerrar a pausa e desbloquear a interface
  const handleEncerrarPausa = async () => {
    console.log("🚀 Tentando encerrar a pausa...");
  
    if (!pausaAtiva || !pausaAtiva.id) {
      console.log("⚠️ Nenhuma pausa ativa encontrada ou ID inválido.", pausaAtiva);
      Alert.alert('Erro', 'Nenhuma pausa ativa encontrada.');
      return;
    }
  
    console.log(`📡 Tentando encerrar a pausa com ID: ${pausaAtiva.id}`);
  
    try {
      // 🔥 Envia a requisição para encerrar a pausa
      const pausaEncerrada = await handleApiRequest(`/pausa/${pausaAtiva.id}`, 'PUT', {});
  
      console.log("✅ Pausa encerrada e estado atualizado!", pausaEncerrada);
  
      // 🔄 Aguarda 1 segundo e busca a pausa da API para garantir que os dados completos sejam carregados
      setTimeout(async () => {
        console.log("🔄 Atualizando lista de pausas...");
        const novasPausas = await fetchUltimasPausas(auditoriaId, 1, 10); // Busca pausas atualizadas
  
        if (novasPausas.pausas.length > 0) {
          setPausaAtiva(novasPausas.pausas[0]); // 🔥 Atualiza corretamente com os novos dados
          console.log("✅ Estado atualizado com a pausa encerrada:", novasPausas.pausas[0]);
        } else {
          setPausaAtiva(null);
          console.warn("⚠️ Nenhuma pausa encontrada após atualização.");
        }
      }, 1000);
  
      setModalVisible(false); // 🔥 Fecha o modal
      Alert.alert('Sucesso', 'Pausa encerrada com sucesso!');
  
    } catch (error) {
      console.error("❌ Erro ao encerrar pausa:", error);
      Alert.alert('Erro', 'Não foi possível encerrar a pausa.');
    }
  };
  
  
  
  
  // Renderiza um indicador de carregamento enquanto os dados estão sendo buscados
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#20B2AA" />
        <Text>Carregando informações...</Text>
      </View>
    );
  }

  // Renderiza o conteúdo principal
  return (
    <View style={styles.contentContainer}>
      <Text style={styles.sectionTitle}>Motivo da Pausa:</Text>
      <Picker
        selectedValue={selectedMotivoPausa}
        onValueChange={(itemValue) => setSelectedMotivoPausa(String(itemValue))}
        style={styles.picker}
      >
        <Picker.Item label="Selecione um motivo" value="" />
        {motivopausa.map((motivo) => (
          <Picker.Item key={motivo.id} label={motivo.name} value={String(motivo.id)} />
        ))}
      </Picker>

      <TouchableOpacity style={styles.button} onPress={handleCadPausa}>
        <Text style={styles.buttonText}>Adicionar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => setActiveTab('UltimasPausas')}>
        <Text style={styles.buttonText}>Últimas Pausas</Text>
      </TouchableOpacity>

      {/* Renderiza uma mensagem de erro, se houver */}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* 🔥 MODAL PARA BLOQUEAR A INTERFACE DURANTE A PAUSA 🔥 */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>⏳ Pausa em andamento</Text>
          
          <TouchableOpacity style={styles.modalButton} onPress={handleEncerrarPausa}>
  <Text style={styles.modalButtonText}>Encerrar Pausa</Text>
</TouchableOpacity>

        </View>
      </Modal>
    </View>
  );
};

// 🔥 Estilos para melhorar a UX
const modalStyles = {
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalText: {
    fontSize: 18,
    color: 'white',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#FF6347',
    padding: 15,
    borderRadius: 10,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
};

// 🔥 Une os estilos existentes com os novos estilos de modal
Object.assign(styles, modalStyles);

export default PausasTab;
