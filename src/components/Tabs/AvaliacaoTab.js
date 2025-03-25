import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import styles from '../../styles/AuditoriaScreenStyles';
import useAuditoriaDetails from '../../hooks/useAuditoriaDetails';

const AvaliacaoTab = ({ auditoriaId, setActiveTab }) => {
  const {
    cadastrarAvaliacao,
    fetchCadAvaliacao,
    fetchPerguntasAvaliacao,
    cadAvaliacao,
    perguntas,
    loading,
    error
  } = useAuditoriaDetails();

  // Estados para avaliação, pergunta, nota e resposta
  const [selectedAvaliacao, setSelectedAvaliacao] = useState('');
  const [selectedPergunta, setSelectedPergunta] = useState('');
  const [selectedNota, setSelectedNota] = useState('');
  const [selectedResposta, setSelectedResposta] = useState('');

  // Busca as perguntas disponíveis ao carregar o componente
  useEffect(() => {
    const fetchData = async () => {
      await fetchCadAvaliacao();
    };
    fetchData();
  }, []);

  // Quando a avaliação é selecionada, recarrega as perguntas
  useEffect(() => {
    if (selectedAvaliacao) {
      // Chama fetchPerguntasAvaliacao passando o ID
      fetchPerguntasAvaliacao(selectedAvaliacao);
    }
  }, [selectedAvaliacao]);

  // Função para cadastrar uma nova avaliação
  const handleCadAvaliacao = async () => {
    if (!selectedAvaliacao) {
      Alert.alert('Por favor, selecione a avaliação.');
      return;
    }
    if (!selectedPergunta) {
      Alert.alert('Por favor, selecione a pergunta.');
      return;
    }
    if (!selectedNota) {
      Alert.alert('Por favor, selecione uma nota.');
      return;
    }
    if (!selectedResposta.trim()) {
      Alert.alert('Por favor, digite uma resposta.');
      return;
    }
    try {
      const avaliacao = {
        cadavoperacionalId: parseInt(selectedAvaliacao, 10),
        cadquestoesId: parseInt(selectedPergunta, 10),
        auditoriaId: parseInt(auditoriaId, 10),
        nota: parseInt(selectedNota, 10),
        resposta: selectedResposta
      };

      console.log('Enviando avaliação:', avaliacao);
      await cadastrarAvaliacao(avaliacao);
      Alert.alert('Sucesso', 'Avaliação cadastrada com sucesso!');

      // Limpa os campos após cadastro
      setSelectedPergunta('');
      setSelectedNota('');
      setSelectedResposta('');
    } catch (err) {
      console.error('Erro ao cadastrar avaliação:', err);
      Alert.alert('Erro', 'Não foi possível cadastrar a avaliação.');
    }
  };


  // Renderiza um indicador de carregamento enquanto os dados estão sendo buscados
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#778899" />
        <Text>Carregando informações...</Text>
      </View>
    );
  }

  // Renderiza o conteúdo principal
  return (
    <View style={styles.contentContainer}>
      <Text style={styles.sectionTitle}>Avaliação:</Text>
      <Picker
        selectedValue={selectedAvaliacao}
        onValueChange={(itemValue) => setSelectedAvaliacao(String(itemValue))}
        style={styles.picker}
      >
        <Picker.Item label="Selecione a avaliação" value="" />
        {cadAvaliacao && cadAvaliacao.length > 0 ? (
          cadAvaliacao.map((item) => (
            <Picker.Item key={item.id} label={item.descricao} value={String(item.id)} />
          ))
        ) : (
          <Picker.Item label="Nenhuma avaliação disponível" value="" />
        )}
      </Picker>

      <Text style={styles.sectionTitle}>Pergunta:</Text>
      <Picker
        selectedValue={selectedPergunta}
        onValueChange={(itemValue) => setSelectedPergunta(String(itemValue))}
        style={styles.picker}
      >
        <Picker.Item label="Selecione uma pergunta" value="" />
        {perguntas && perguntas.length > 0 ? (
  perguntas.map((p) => (
    <Picker.Item key={p.id} label={p.name} value={String(p.id)} />
  ))
        ) : (
        <Picker.Item label="Nenhuma pergunta disponível" value="" />
            )}
      </Picker>

      <Text style={styles.notaTitle}>Nota:</Text>
      <Picker
        selectedValue={selectedNota}
        onValueChange={(itemValue) => setSelectedNota(String(itemValue))}
        style={styles.notaPicker}
      >
        <Picker.Item label="Selecione uma nota" value="" />
        {[1,2,3,4,5,6,7,8,9,10].map((num) => (
          <Picker.Item key={num} label={String(num)} value={String(num)} />
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

      <TouchableOpacity style={styles.button} onPress={handleCadAvaliacao}>
        <Text style={styles.buttonText}>Adicionar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => setActiveTab('UltimasAvaliacoes')}>
        <Text style={styles.buttonText}>Últimas Avaliações</Text>
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default AvaliacaoTab;
