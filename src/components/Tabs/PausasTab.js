import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import styles from '../../styles/AuditoriaScreenStyles';
import useAuditoriaDetails from '../../hooks/useAuditoriaDetails';

const PausasTab = ({ auditoriaId, setActiveTab }) => {
  const {
    cadastrarPausa,
    fetchMotivoPausa,
    motivopausa,
    loading,
    error
  } = useAuditoriaDetails();

  // Declaração de estados
  const [selectedMotivoPausa, setSelectedMotivoPausa] = useState('');
  const [pausaAtiva, setPausaAtiva] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Busca os motivos de perda ao montar o componente
  useEffect(() => {
    fetchMotivoPausa();
  }, []);

  // Função para cadastrar uma perda
  const handleCadPausa = async () => {
    if (!selectedMotivoPausa) {
      Alert.alert('Erro', 'Selecione um motivo para a pausa.');
      return;
    }


    try {
      const pausa = {
        motivodepausaId: parseInt(selectedMotivoPausa, 10), // ✅ Nome correto conforme o backend
        auditoriaId: parseInt(auditoriaId, 10)
      };

      console.log("📡 Enviando nova pausa para API:", JSON.stringify(pausa, null, 2));

      await cadastrarPausa(pausa);
      Alert.alert('Sucesso', 'Perda cadastrada com sucesso!');

      // Limpa os campos após o cadastro
      setSelectedMotivoPausa('');

      // Redireciona para a lista de perdas
      //setActiveTab('UltimasPerdas');
    } catch (err) {
      console.error('❌ Erro ao cadastrar pausa:', err);
      Alert.alert('Erro', 'Não foi possível cadastrar a pausa.');
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
    </View>
  );
};

export default PausasTab;
