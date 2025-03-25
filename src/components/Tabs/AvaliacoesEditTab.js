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
  if (!avaliacao) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Erro: Nenhuma avaliação selecionada.</Text>
      </View>
    );
  }

  const {
    fetchCadAvaliacao,
    fetchPerguntasAvaliacao,
    atualizarAvaliacao,
    cadAvaliacao,
    perguntas,
    loading,
  } = useAuditoriaDetails();

  // Valores iniciais extraídos da avaliação recebida
  const initialAvaliacao = avaliacao?.cadavoperacional?.id?.toString() || '';
  const initialPergunta = avaliacao?.cadquestoes?.id?.toString() || '';

  const [selectedAvaliacao, setSelectedAvaliacao] = useState(initialAvaliacao);
  const [selectedPergunta, setSelectedPergunta] = useState(initialPergunta);
  const [selectedResposta, setSelectedResposta] = useState(avaliacao?.resposta || '');
  const [selectedNota, setSelectedNota] = useState(avaliacao?.nota?.toString() || '');

  // Carrega as avaliações disponíveis ao montar o componente
  useEffect(() => {
    fetchCadAvaliacao();
  }, []);

  // Quando a avaliação selecionada muda, carrega as perguntas correspondentes.
  // Se o usuário alterar a avaliação (diferente do valor inicial), reseta a pergunta.
  useEffect(() => {
    if (selectedAvaliacao) {
      fetchPerguntasAvaliacao(selectedAvaliacao);
      if (selectedAvaliacao !== initialAvaliacao) {
        setSelectedPergunta('');
      }
      // Caso seja a mesma avaliação da edição, o selectedPergunta permanecerá com o valor do banco.
    }
  }, [selectedAvaliacao]);

  useEffect(() => {
    console.log('Avaliação recebida:', avaliacao);
    console.log('Lista de avaliações (cadAvaliacao):', cadAvaliacao);
    console.log('Lista de perguntas:', perguntas);
  }, [avaliacao, cadAvaliacao, perguntas]);

  const handleEditarAvaliacao = async () => {
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

    const avaliacaoAtualizada = {
      id: avaliacao.id,
      auditoriaId: avaliacao.auditoriaId,
      cadavoperacionalId: parseInt(selectedAvaliacao, 10),
      cadquestoesId: parseInt(selectedPergunta, 10),
      resposta: selectedResposta,
      nota: parseInt(selectedNota, 10),
    };

    console.log('Enviando atualização da avaliação:', JSON.stringify(avaliacaoAtualizada, null, 2));

    try {
      const response = await atualizarAvaliacao(avaliacaoAtualizada);
      if (response && response.id) {
        Alert.alert('Sucesso', 'Avaliação atualizada com sucesso!');
        setActiveTab('UltimasAvaliacoes');
      } else {
        throw new Error('A resposta da API não confirmou a atualização.');
      }
    } catch (err) {
      console.error('Erro ao atualizar avaliação:', err);
      Alert.alert('Erro', 'Não foi possível atualizar a avaliação.');
    }
  };

  return (
    <ScrollView style={styles.contentContainer}>
      <Text style={styles.title}>📋 Editar Avaliação</Text>

      {loading && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginVertical: 10 }}>
          <ActivityIndicator size="large" color="#778899" />
          <Text>Carregando...</Text>
        </View>
      )}

      {!loading && (
        <>
          {/* Campo Avaliação */}
          <Text style={styles.sectionTitle}>Avaliação:</Text>
          <Picker
            selectedValue={selectedAvaliacao}
            onValueChange={(itemValue) => setSelectedAvaliacao(String(itemValue))}
            style={styles.picker}
          >
            <Picker.Item label="Selecione a avaliação" value="" />
            {cadAvaliacao && cadAvaliacao.length > 0 ? (
              cadAvaliacao.map((item) => (
                <Picker.Item 
                  key={item.id} 
                  label={item.descricao} 
                  value={String(item.id)} 
                />
              ))
            ) : (
              <Picker.Item label="Nenhuma avaliação encontrada" value="" />
            )}
          </Picker>

          {/* Campo Pergunta */}
          <Text style={styles.sectionTitle}>Pergunta:</Text>
          <Picker
            selectedValue={selectedPergunta}
            onValueChange={(itemValue) => setSelectedPergunta(String(itemValue))}
            style={styles.picker}
          >
            <Picker.Item label="Selecione a pergunta" value="" />
            {perguntas && perguntas.length > 0 ? (
              perguntas.map((pergunta) => (
                <Picker.Item
                  key={pergunta.id}
                  label={pergunta.name}
                  value={String(pergunta.id)}
                />
              ))
            ) : (
              <Picker.Item label="Nenhuma pergunta encontrada" value="" />
            )}
          </Picker>

          {/* Campo Nota */}
          <Text style={styles.notaTitle}>Nota:</Text>
          <Picker
            selectedValue={selectedNota}
            onValueChange={(itemValue) => setSelectedNota(String(itemValue))}
            style={styles.notaPicker}
          >
            <Picker.Item label="Selecione uma nota" value="" />
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <Picker.Item key={num} label={String(num)} value={String(num)} />
            ))}
          </Picker>

          {/* Campo Resposta */}
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
