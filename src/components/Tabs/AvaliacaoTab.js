import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import styles from '../../styles/AuditoriaScreenStyles';
import useAuditoriaDetails from '../../hooks/useAuditoriaDetails';

const AvaliacaoTab = ({ auditoriaId, setActiveTab }) => {
  const {
    cadastrarAvaliacao,
    fetchPerguntasAvaliacao,
    perguntas,
    loading,
    error
  } = useAuditoriaDetails();

  // Declaração de estados
  const [selectedPergunta, setSelectedPergunta] = useState('');
  const [selectedResposta, setSelectedResposta] = useState('');

  // ✅ Busca as perguntas disponíveis ao carregar o componente
  useEffect(() => {
    const fetchData = async () => {
      await fetchPerguntasAvaliacao();
    };
    fetchData();
  }, []);

  useEffect(() => {
    console.log("📡 Perguntas disponíveis:", perguntas);
  }, [perguntas]);

  // ✅ Função para cadastrar uma nova avaliação
  const handleCadAvalicao = async () => {
    if (!selectedPergunta) {
      Alert.alert('Erro', 'Selecione uma pergunta.');
      return;
    }
    if (!selectedResposta.trim()) {
      Alert.alert('Erro', 'Digite uma resposta válida.');
      return;
    }

    try {
      const avaliacao = {
        perguntaID: parseInt(selectedPergunta, 10), 
        resposta: selectedResposta,
        auditoriaId: parseInt(auditoriaId, 10)
      };

      console.log("📡 Enviando nova avaliação para API:", JSON.stringify(avaliacao, null, 2));

      await cadastrarAvaliacao(avaliacao);
      Alert.alert('Sucesso', 'Avaliação cadastrada com sucesso!');

      // 🔥 Limpa os campos após o cadastro
      setSelectedPergunta('');
      setSelectedResposta('');

      // 🔄 Atualiza a lista de perguntas após o cadastro
      fetchPerguntasAvaliacao();

    } catch (err) {
      console.error('❌ Erro ao cadastrar avaliação:', err);
      Alert.alert('Erro', 'Não foi possível cadastrar a avaliação.');
    }
  };

  // ✅ Renderiza um indicador de carregamento enquanto os dados estão sendo buscados
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#20B2AA" />
        <Text>Carregando informações...</Text>
      </View>
    );
  }

  // ✅ Renderiza o conteúdo principal
  return (
    <View style={styles.contentContainer}>
      <Text style={styles.sectionTitle}>Pergunta:</Text>
      <Picker
        selectedValue={selectedPergunta}
        onValueChange={(itemValue) => setSelectedPergunta(String(itemValue))}
        style={styles.picker}
      >
        <Picker.Item label="Selecione uma pergunta" value="" />
        {perguntas.length > 0 ? (
          perguntas.map((pergunta) => (
            <Picker.Item key={pergunta.id} label={pergunta.descricao} value={String(pergunta.id)} />
          ))
        ) : (
          <Picker.Item label="Nenhuma pergunta disponível" value="" />
        )}
      </Picker>

      <Text style={styles.sectionTitle}>Resposta:</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Digite sua resposta"
        placeholderTextColor="#888"
        multiline
        numberOfLines={4}
        value={selectedResposta}
        onChangeText={setSelectedResposta}
      />

      <TouchableOpacity style={styles.button} onPress={handleCadAvalicao}>
        <Text style={styles.buttonText}>Adicionar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => setActiveTab('UltimasAvaliacoes')}>
        <Text style={styles.buttonText}>Últimas Avaliações</Text>
      </TouchableOpacity>

      {/* 🔥 Renderiza uma mensagem de erro, se houver */}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default AvaliacaoTab;
