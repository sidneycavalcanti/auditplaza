import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Switch,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'; // 🔥 Importa o ajuste para o teclado
import useAuditoriaDetails from '../../hooks/useAuditoriaDetails';


import usePausa from '../../hooks/usePausa';
import PausaModal from '../PausaModal';

import styles from '../../styles/AuditoriaScreenStyles';

const VendasTab = ({ auditoriaId, userId, lojaId, setActiveTab }) => {

  const { pausaAtiva, modalVisible, handleEncerrarPausa } = usePausa(auditoriaId ?? null);


  const {
    fetchSexos,
    fetchFormasPagamento,
    cadastrarVenda,
    formasPagamento,
    sexos,
    loading,
    error,
  } = useAuditoriaDetails();

  const [valor, setValor] = useState('');
  const [faixaEtaria, setFaixaEtaria] = useState('adulto');
  const [selectedSexo, setSelectedSexo] = useState('');
  const [selectedFormaPagamento, setSelectedFormaPagamento] = useState('');
  const [observacao, setObservacao] = useState('');
  const [isTrocaChecked, setIsTrocaChecked] = useState(false);

  useEffect(() => {
    fetchSexos();
    fetchFormasPagamento();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#20B2AA" />
        <Text>Carregando informações...</Text>
      </View>
    );
  }

  const handleAdicionarVenda = async () => {
    if (!valor || isNaN(Number(valor.replace(',', '.'))) || Number(valor.replace(',', '.')) <= 0) {
      Alert.alert('Erro', 'Por favor, insira um valor numérico válido.');
      return;
    }

    if (!selectedSexo) {
      Alert.alert('Erro', 'Selecione um sexo.');
      return;
    }

    if (!selectedFormaPagamento) {
      Alert.alert('Erro', 'Selecione uma forma de pagamento.');
      return;
    }

    if (!faixaEtaria) {
      Alert.alert('Erro', 'Selecione uma faixa etária.');
      return;
    }

    const venda = {
      valor: parseFloat(valor.replace(',', '.')),
      faixaetaria: faixaEtaria,
      sexoId: parseInt(selectedSexo, 10),
      formadepagamentoId: parseInt(selectedFormaPagamento, 10),
      auditoriaId: parseInt(auditoriaId, 10),
      usuarioId: parseInt(userId, 10),
      lojaId: parseInt(lojaId, 10),
      observacao,
      troca: isTrocaChecked,
    };

    console.log("📡 Enviando venda para API:", JSON.stringify(venda, null, 2));

    try {
      await cadastrarVenda(venda);
      Alert.alert('Sucesso', 'Venda cadastrada com sucesso!');
      setValor('');
      setSelectedSexo('');
      setSelectedFormaPagamento('');
      setFaixaEtaria('adulto');
      setObservacao('');
      setIsTrocaChecked(false);
    } catch (err) {
      console.error("❌ Erro ao salvar venda:", err);
      Alert.alert('Erro', 'Não foi possível salvar a venda.');
    }
  };

  return (

    
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={{ flex: 1 }}
    >
       {/* 🔥 Exibe o modal se houver uma pausa ativa */}
       <PausaModal visible={modalVisible} pausaAtiva={pausaAtiva} onClose={handleEncerrarPausa} />
      <KeyboardAwareScrollView 
        style={{ flex: 1 }} 
        contentContainerStyle={styles.contentContainer} 
        enableOnAndroid={true}
        extraScrollHeight={20} // 🔥 Ajusta a altura ao abrir o teclado
      >
        <Text style={styles.sectionTitle}>Valor:</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o valor"
          keyboardType="numeric"
          value={valor}
          onChangeText={setValor}
        />

        <Text style={styles.sectionTitle}>Sexo:</Text>
        <Picker
          selectedValue={selectedSexo}
          onValueChange={(itemValue) => setSelectedSexo(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Selecione o sexo" value="" />
          {sexos.map((sexo) => (
            <Picker.Item key={sexo.id} label={sexo.name} value={String(sexo.id)} />
          ))}
        </Picker>

        <Text style={styles.sectionTitle}>Forma de Pagamento:</Text>
        <Picker
          selectedValue={selectedFormaPagamento}
          onValueChange={(itemValue) => setSelectedFormaPagamento(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Selecione a forma de pagamento" value="" />
          {formasPagamento.map((forma) => (
            <Picker.Item key={forma.id} label={forma.name} value={String(forma.id)} />
          ))}
        </Picker>

        <Text style={styles.sectionTitle}>Faixa Etária:</Text>
        <Picker
          selectedValue={faixaEtaria}
          onValueChange={(itemValue) => setFaixaEtaria(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Infantil" value="infantil" />
          <Picker.Item label="Adolescente" value="adolescente" />
          <Picker.Item label="Adulto" value="adulto" />
          <Picker.Item label="Idoso" value="idoso" />
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

        <View style={styles.checkboxContainer}>
          <View style={styles.switchWrapper}>
            <Text>Troca</Text>
            <Switch
              value={isTrocaChecked}
              onValueChange={setIsTrocaChecked}
              trackColor={{ false: '#767577', true: '#20B2AA' }}
              thumbColor={isTrocaChecked ? '#20B2AA' : '#f4f3f4'}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleAdicionarVenda}>
          <Text style={styles.buttonText}>
            {loading ? 'Adicionando...' : 'Adicionar'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => setActiveTab('UltimasVendas')}>
          <Text style={styles.buttonText}>
            {loading ? 'Abrindo últimas vendas...' : 'Últimas Vendas'}
          </Text>
        </TouchableOpacity>

        {error && <Text style={styles.errorText}>{error}</Text>}
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
};

export default VendasTab;
