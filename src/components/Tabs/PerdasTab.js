import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import styles from '../../styles/AuditoriaScreenStyles';
import useAuditoriaDetails from '../../hooks/useAuditoriaDetails';

const PerdasTab = ({ auditoriaId, setActiveTab }) => {
  const {
    cadastrarPerda,
    fetchMotivoPerdas,
    motivoperdas,
    loading,
    error
  } = useAuditoriaDetails();

  // Declaração de estados
  const [selectedMotivoPerda, setSelectedMotivoPerda] = useState('');
  const [selectedObs, setSelectedObs] = useState('');

  // Busca os motivos de perda ao montar o componente
  useEffect(() => {
    fetchMotivoPerdas();
  }, []);

  // Função para cadastrar uma perda
  const handleCadPerdas = async () => {
    if (!selectedMotivoPerda) {
      Alert.alert('Erro', 'Selecione um motivo para a perda.');
      return;
    }
    if (!selectedObs) {
      Alert.alert('Erro', 'Digite uma descrição para a perda.');
      return;
    }

    try {
      const perda = {
        motivoperdasId: parseInt(selectedMotivoPerda, 10), // ID do motivo da perda
        obs: selectedObs,
        auditoriaId: parseInt(auditoriaId, 10)
      };

      console.log("📡 Enviando nova perda para API:", JSON.stringify(perda, null, 2));

      await cadastrarPerda(perda);
      Alert.alert('Sucesso', 'Perda cadastrada com sucesso!');

      // Limpa os campos após o cadastro
      setSelectedMotivoPerda('');
      setSelectedObs('');

      // Redireciona para a lista de perdas
      //setActiveTab('UltimasPerdas');
    } catch (err) {
      console.error('❌ Erro ao cadastrar perda:', err);
      Alert.alert('Erro', 'Não foi possível cadastrar a perda.');
    }
  };

  // Renderiza um indicador de carregamento enquanto os dados estão sendo buscados
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#375A7F" />
        <Text>Carregando informações...</Text>
      </View>
    );
  }

  // Renderiza o conteúdo principal
  return (
    <View style={styles.contentContainer}>
      <Text style={styles.sectionTitle}>Motivo da Perda:</Text>
      <Picker
        selectedValue={selectedMotivoPerda}
        onValueChange={(itemValue) => setSelectedMotivoPerda(String(itemValue))}
        style={styles.picker}
      >
        <Picker.Item label="Selecione um motivo" value="" />
        {motivoperdas.map((motivo) => (
          <Picker.Item key={motivo.id} label={motivo.name} value={String(motivo.id)} />
        ))}
      </Picker>

      <Text style={styles.sectionTitle}>Observação:</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Digite suas observações"
        placeholderTextColor="#888"
        multiline
        numberOfLines={4}
        value={selectedObs}
        onChangeText={setSelectedObs}
      />

      <TouchableOpacity style={styles.button} onPress={handleCadPerdas}>
        <Text style={styles.buttonText}>Adicionar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => setActiveTab('UltimasPerdas')}>
        <Text style={styles.buttonText}>Últimas Perdas</Text>
      </TouchableOpacity>

      {/* Renderiza uma mensagem de erro, se houver */}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default PerdasTab;
