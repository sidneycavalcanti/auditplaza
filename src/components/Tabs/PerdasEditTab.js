import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import useAuditoriaDetails from '../../hooks/useAuditoriaDetails';
import styles from '../../styles/AuditoriaScreenStyles';

const PerdasEditTab = ({ perda, setActiveTab }) => {
  if (!perda) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Erro: Nenhuma perda selecionada.</Text>
      </View>
    );
  }

  const {
    fetchPerdas,
    fetchMotivoPerdas,
    atualizarPerda,
    perdas,
    motivoperdas,
    loading
  } = useAuditoriaDetails();

  // 🚀 Inicializa os estados corretamente
  const [selectedMotivoPerda, setSelectedMotivoPerda] = useState(perda?.motivoperdas?.id?.toString() || '');
  const [observacao, setObservacao] = useState(perda?.obs || '');

  // 🚀 Carregar listas de perdas e motivos de perda
  useEffect(() => {
    const loadData = async () => {
      await fetchPerdas();
      await fetchMotivoPerdas();
    };
    loadData();
  }, []);

  // 🔍 Log para depuração
  useEffect(() => {
    console.log("📥 Perda recebida para edição:", perda);
    console.log("🗂️ Motivos de Perda carregados:", motivoperdas);
    console.log("📋 Lista de Perdas carregada:", perdas);
  }, [perda, motivoperdas, perdas]);

  const handleEditarPerda = async () => {
    if (!selectedMotivoPerda) {
      Alert.alert('Por favor, selecione um motivo da perda.');
      return;
    }
     if (!observacao) {
          Alert.alert('Por favor, digite sua observação.');
          return;
        }
  
    const perdaAtualizada = {
      id: perda.id,
      auditoriaId: perda.auditoriaId,
      motivoperdasId: parseInt(selectedMotivoPerda, 10),
      obs: observacao, // 🔥 Verifique se a API espera "obs" e não "observacao"
    };
  
    console.log("📡 Enviando atualização da perda:", JSON.stringify(perdaAtualizada, null, 2));
  
    try {
      const response = await atualizarPerda(perdaAtualizada);
      console.log("🔍 Resposta da API ao atualizar perda:", response);
  
      // Verifica se a resposta contém um ID, confirmando que foi atualizada
      if (response && response.id) {  
        Alert.alert('Sucesso', 'Perda atualizada com sucesso!');
        setActiveTab('UltimasPerdas'); // Retorna à lista de perdas
      } else {
        throw new Error('A resposta da API não confirmou a atualização.');
      }
  } catch (err) {
      console.error("❌ Erro ao atualizar perda:", err);
      Alert.alert('Erro', 'Não foi possível atualizar a perda.');
  }
  };

  return (
    <ScrollView style={styles.contentContainer}>
      <Text style={styles.title}>📋 Editar Perda</Text>

      {loading && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginVertical: 10 }}>
          <ActivityIndicator size="large" color="#778899"  />
          <Text>Carregando...</Text>
        </View>
      )}

      {!loading && (
        <>
          <Text style={styles.sectionTitle}>Motivo da Perda:</Text>
          <Picker
            selectedValue={selectedMotivoPerda}
            onValueChange={(itemValue) => setSelectedMotivoPerda(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Selecione o motivo da perda" value="" />
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
            value={observacao}
            onChangeText={setObservacao}
          />

          <TouchableOpacity style={styles.button} onPress={handleEditarPerda}>
            <Text style={styles.buttonText}>Salvar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => setActiveTab('UltimasPerdas')}>
            <Text style={styles.buttonText}>Voltar</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

export default PerdasEditTab;
