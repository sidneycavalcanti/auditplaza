import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import styles from '../../styles/AuditoriaScreenStyles';
import useAuditoriaDetails from '../../hooks/useAuditoriaDetails';

const PerdasTab = () => {
  const { 
    cadastrarPerda, 
    fetchPerdas, 
    fetchMotivoPerdas, 
    fetchUltimasPerdas,
    motivoperdas, 
    perdas, 
    loading, 
    error } = useAuditoriaDetails();

  // Declaração de estados
  const [motivoPerdas, setMotivoperdas] = useState('');
  const [selectedPerda, setSelectedPerda] = useState('');
  const [descricao, setDescricao] = useState('');

  // Busca inicial das perdas ao montar o componente
  useEffect(() => {
    fetchMotivoPerdas();
    fetchPerdas();
  }, []);

  // Função para cadastrar uma perda
  const handleCadPerdas = async () => {
    if (!selectedPerda) {
      Alert.alert('Erro', 'Selecione um motivo para a perda.');
      return;
    }
    if (!descricao) {
      Alert.alert('Erro', 'Digite uma descrição para a perda.');
      return;
    }

    try {
      const perda = {
        motivoId: parseInt(selectedPerda), // ID do motivo da perda
        descricao, // Observação
      };

      await cadastrarPerda(perda); // Chama a função para cadastrar a perda
      Alert.alert('Sucesso', 'Perda cadastrada com sucesso!');
      setSelectedPerda(''); // Limpa o campo motivo
      setDescricao(''); // Limpa o campo descrição
    } catch (err) {
      console.error('Erro ao cadastrar perda:', err);
      Alert.alert('Erro', 'Não foi possível cadastrar a perda.');
    }
  };

  // Função para cadastrar uma perda
   const handleUltimasPerdas = async () => {
      try {
        const perdas = await fetchUltimasPerdas(auditoriaId); // Passe o auditoriaId como parâmetro
    
        // Verifique se as vendas foram retornadas
        if (!perdas || perdas.length === 0) {
          Alert.alert('Sem Perdas', 'Não há perdas cadastradas para esta auditoria.');
          return;
        }
    
        // Renderiza uma nova tela ou modal com as vendas
        navigation.navigate('UltimasPerdas', { perdas });
      } catch (error) {
        console.error('Erro ao listar perdas:', error.message);
        Alert.alert('Erro', 'Não foi possível listar as últimas perdas.');
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
      <Text style={styles.sectionTitle}>Motivo da Perda:</Text>
      <Picker
        selectedValue={selectedPerda}
        onValueChange={(itemValue) => setSelectedPerda(String(itemValue))}
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
        value={descricao}
        onChangeText={setDescricao}
      />

      <TouchableOpacity style={styles.button} onPress={handleCadPerdas}>
        <Text style={styles.buttonText}>Adicionar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleUltimasPerdas}>
        <Text style={styles.buttonText}>Ultimas perdas </Text>
      </TouchableOpacity>


      {/* Renderiza uma mensagem de erro, se houver */}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
    
  );
};

export default PerdasTab;
