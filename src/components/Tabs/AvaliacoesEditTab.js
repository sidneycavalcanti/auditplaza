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

const AvaliacoesEditTab = ({ avaliacao, setActiveTab }) => {
  // Se não vier uma avaliação, exibe erro
  if (!avaliacao) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Erro: Nenhuma avaliação selecionada.</Text>
      </View>
    );
  }

  const {
    fetchAvaliacao,
    fetchPerguntasAvaliacao,
    atualizarAvaliacao,
    avaliacoes,
    perguntas,
    loading,
  } = useAuditoriaDetails();

  // Estados locais para armazenar a pergunta selecionada e a resposta
  // Usamos o ID de cadavoperacional que veio em 'avaliacao'
  const [selectedPergunta, setSelectedPergunta] = useState(
    avaliacao?.cadavoperacional?.id?.toString() || ''
  );
  const [selectedResposta, setSelectedResposta] = useState(
    avaliacao?.resposta || ''
  );

  // Carrega as avaliações e as perguntas disponíveis ao montar o componente
  useEffect(() => {
    const loadData = async () => {
      await fetchAvaliacao();          // Se quiser atualizar a lista de avaliações
      await fetchPerguntasAvaliacao(); // Para preencher o Picker com as perguntas
    };
    loadData();
  }, []);

  // Logs de depuração
  useEffect(() => {
    console.log('📥 Avaliação recebida para edição:', avaliacao);
    console.log('🗂️ Pergunta selecionada (ID):', selectedPergunta);
    console.log('📋 Lista de avaliações carregada:', avaliacoes);
    console.log('🔎 Lista de perguntas carregadas:', perguntas);
  }, [avaliacao, selectedPergunta, avaliacoes, perguntas]);

  // Função para salvar as alterações da avaliação
  const handleEditarAvaliacao = async () => {
    // Verifica se escolheu uma pergunta
    if (!selectedPergunta) {
      Alert.alert('Erro', 'Por favor, selecione uma pergunta.');
      return;
    }

    // Monta o objeto de atualização
    const avaliacaoAtualizada = {
      id: avaliacao.id,
      auditoriaId: avaliacao.auditoriaId,
      cadavoperacionalId: parseInt(selectedPergunta, 10), // Campo que o backend espera
      resposta: selectedResposta,
    };

    console.log(
      '📡 Enviando atualização da avaliação:',
      JSON.stringify(avaliacaoAtualizada, null, 2)
    );

    try {
      const response = await atualizarAvaliacao(avaliacaoAtualizada);
      console.log('🔍 Resposta da API ao atualizar avaliação:', response);

      // Se a API retornou um objeto com ID, consideramos que deu certo
      if (response && response.id) {
        Alert.alert('Sucesso', 'Avaliação atualizada com sucesso!');
        setActiveTab('UltimasAvaliacoes'); // Volta para a lista de avaliações
      } else {
        throw new Error('A resposta da API não confirmou a atualização.');
      }
    } catch (err) {
      console.error('❌ Erro ao atualizar avaliação:', err);
      Alert.alert('Erro', 'Não foi possível atualizar a avaliação.');
    }
  };

  return (
    <ScrollView style={styles.contentContainer}>
      <Text style={styles.title}>📋 Editar Avaliação</Text>

      {/* Indicador de carregamento */}
      {loading && (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: 10,
          }}
        >
          <ActivityIndicator size="large" color="#20B2AA" />
          <Text>Carregando...</Text>
        </View>
      )}

      {/* Formulário de edição (exibido quando não está carregando) */}
      {!loading && (
        <>
          <Text style={styles.sectionTitle}>Pergunta:</Text>
          <Picker
            selectedValue={selectedPergunta}
            onValueChange={(itemValue) => setSelectedPergunta(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Selecione a Pergunta" value="" />
            {perguntas.map((pergunta) => (
              <Picker.Item
                key={pergunta.id}
                label={pergunta.descricao} // Ajuste se a pergunta tiver outro campo de texto
                value={String(pergunta.id)}
              />
            ))}
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

          <TouchableOpacity style={styles.button} onPress={handleEditarAvaliacao}>
            <Text style={styles.buttonText}>Salvar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => setActiveTab('UltimasAvaliacoes')}>
            <Text style={styles.buttonText}>Voltar</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

export default AvaliacoesEditTab;
