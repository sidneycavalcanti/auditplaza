import React, { useState } from 'react';
import {
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator
} from 'react-native';

import styles from '../../styles/AuditoriaScreenStyles';


import useAuditoriaDetails from '../../hooks/useAuditoriaDetails';


const AnotacoesTab = ({ auditoriaId, usuarioId, lojaId, setActiveTab }) => {

  const { cadastrarAnotacao, loading, error } = useAuditoriaDetails();

 // Declaração de estados
  const [selectAnotation, setSelectAnotation] = useState('');


    // Função para cadastrar uma antonacao
    const addAnnotation = async () => {
      if (!selectAnotation) {
        Alert.alert('Erro', 'Preencha o campo de anotações.');
        return;
      }
  
      try {
        const anotacoes = {
          auditoriaId: auditoriaId ? parseInt(auditoriaId, 10) : null,
          usuarioId: usuarioId ? parseInt(usuarioId, 10) : null, // ✅ Agora está correto!
          lojaId: lojaId ? parseInt(lojaId, 10) : null,
          descricao: selectAnotation
        };
  
        console.log("📡 Enviando nova anotação para API:", JSON.stringify(anotacoes, null, 2));
  
        await cadastrarAnotacao(anotacoes);
        Alert.alert('Sucesso', 'Anotação cadastrada com sucesso!');
  
        // Limpa os campos após o cadastro
        setSelectAnotation('');
  
        // Redireciona para a lista de anotações (caso necessário)
        if (setActiveTab) setActiveTab('UltimasAnotacoes');
  
      } catch (err) {
        console.error('❌ Erro ao cadastrar anotações:', err);
        Alert.alert('Erro', 'Não foi possível cadastrar a anotação.');
      }
  };
  
  

  // Renderiza um indicador de carregamento enquanto os dados estão sendo buscados
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large"  color="#778899"  />
        <Text>Carregando informações...</Text>
      </View>
    );
  }

  return (
    <View style={styles.contentContainer}>
      <Text style={styles.sectionTitle}>Anotações</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Digite suas anotações"
        placeholderTextColor="#888"
        multiline
        numberOfLines={4}
        value={selectAnotation}
        onChangeText={setSelectAnotation}
      />

      <TouchableOpacity style={styles.button} onPress={addAnnotation}>
        <Text style={styles.buttonText}>Adicionar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => setActiveTab('UltimasAnotacoes')}>
        <Text style={styles.buttonText}>Ultimas Anotações</Text>
      </TouchableOpacity>

       {/* Renderiza uma mensagem de erro, se houver */}
            {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default AnotacoesTab;