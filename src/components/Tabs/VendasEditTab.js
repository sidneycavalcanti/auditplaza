import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

import useAuditoriaDetails from '../../hooks/useAuditoriaDetails';

import styles from '../../styles/AuditoriaScreenStyles';

const VendasEditTab = ({ venda, navigation, setActiveTab }) => {
  if (!venda) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Erro: Nenhuma venda selecionada.</Text>
      </View>
    );
  }

  const { fetchSexos, fetchFormasPagamento, atualizarVenda, loading } = useAuditoriaDetails();

  // Verificações de segurança para evitar valores indefinidos
  const [valor, setValor] = useState(venda?.valor?.toString() || '');
  const [faixaEtaria, setFaixaEtaria] = useState(venda?.faixaEtaria || 'adulto');
  const [selectedSexo, setSelectedSexo] = useState(venda?.sexoId?.toString() || '');
  const [selectedFormaPagamento, setSelectedFormaPagamento] = useState(venda?.formaPagamentoId?.toString() || '');
  const [sexos, setSexos] = useState([]);
  const [formasPagamento, setFormasPagamento] = useState([]);
  const [observacao, setObservacao] = useState(venda?.observacao?.toString() || '');
  const [isTrocaChecked, setIsTrocaChecked] = useState(venda?.troca); // Estado para "Troca"
  

  useEffect(() => {
    console.log('Dados recebidos para edição:', venda);
  }, [venda]);

  useEffect(() => {
    const loadData = async () => {
      const fetchedSexos = await fetchSexos();
      const fetchedFormasPagamento = await fetchFormasPagamento();
      setSexos(fetchedSexos);
      setFormasPagamento(fetchedFormasPagamento);
    };

    loadData();
  }, []);

  const handleEditarVenda = async () => {
    if (!valor || isNaN(Number(valor.replace(',', '.'))) || Number(valor.replace(',', '.')) <= 0) {
      Alert.alert('Erro', 'Por favor, insira um valor numérico válido.');
      return;
    }

    const vendaAtualizada = {
      ...venda, // Mantém os dados existentes
      valor: parseFloat(valor.replace(',', '.')),
      faixaEtaria,
      sexoId: parseInt(selectedSexo),
      formaPagamentoId: parseInt(selectedFormaPagamento),
    };

    try {
      await atualizarVenda(vendaAtualizada);
      Alert.alert('Sucesso', 'Venda atualizada com sucesso!');
      navigation.goBack(); // Volta para a tela anterior
    } catch (err) {
      console.error('Erro ao atualizar venda:', err);
      Alert.alert('Erro', 'Não foi possível atualizar a venda.');
    }
  };

  {/*if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#20B2AA" />
        <Text>Carregando...</Text>
      </View>
    );
  }*/}

  return (
    <ScrollView style={styles.contentContainer}>
      <Text style={styles.title}>📋 Editar Venda</Text>
      {/* 🔥 Loading agora aparece logo após o título */}
    {loading && (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginVertical: 10 }}>
        <ActivityIndicator size="large" color="#20B2AA" />
        <Text>Carregando...</Text>
      </View>
    )}

    {/* 🔥 Campos de edição só aparecem quando o loading termina */}
    {!loading && (
      <>
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
        {Array.isArray(sexos) && sexos.map((sexo) => (
          <Picker.Item key={sexo.id} label={sexo.name} value={sexo.id.toString()} />
        ))}
      </Picker>

      <Text style={styles.sectionTitle}>Forma de Pagamento:</Text>
      <Picker
        selectedValue={selectedFormaPagamento}
        onValueChange={(itemValue) => setSelectedFormaPagamento(itemValue)}
        style={styles.picker}
      >
      {Array.isArray(formasPagamento) && formasPagamento.map((forma) => (
          <Picker.Item key={forma.id} label={forma.name} value={forma.id.toString()} />
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

      <TouchableOpacity style={styles.button} onPress={handleEditarVenda}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={()=> setActiveTab('UltimasVendas')}>
        <Text style={styles.buttonText}>Voltar</Text>
      </TouchableOpacity>
      </>
      )}
    </ScrollView>
    
  );
};



export default VendasEditTab;
