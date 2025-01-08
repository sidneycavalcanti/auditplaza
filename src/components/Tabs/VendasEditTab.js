import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

import useAuditoriaDetails from '../../hooks/useAuditoriaDetails';



const VendasEditTab = ({ route, navigation }) => {
  const { fetchSexos, fetchFormasPagamento, atualizarVenda, loading } = useAuditoriaDetails();

  const { venda } = route.params || {};

  // Verificações de segurança para evitar valores indefinidos
  const [valor, setValor] = useState(venda?.valor?.toString() || '');
  const [faixaEtaria, setFaixaEtaria] = useState(venda?.faixaEtaria || 'adulto');
  const [selectedSexo, setSelectedSexo] = useState(venda?.sexoId?.toString() || '');
  const [selectedFormaPagamento, setSelectedFormaPagamento] = useState(venda?.formaPagamentoId?.toString() || '');
  const [sexos, setSexos] = useState([]);
  const [formasPagamento, setFormasPagamento] = useState([]);

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

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#20B2AA" />
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/*<Text style={styles.title}>Editar Venda</Text>*/}

      <Text style={styles.label}>Valor:</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o valor"
        keyboardType="numeric"
        value={valor}
        onChangeText={setValor}
      />

      <Text style={styles.label}>Sexo:</Text>
      <Picker
        selectedValue={selectedSexo}
        onValueChange={(itemValue) => setSelectedSexo(itemValue)}
        style={styles.picker}
      >
        {Array.isArray(sexos) && sexos.map((sexo) => (
          <Picker.Item key={sexo.id} label={sexo.name} value={sexo.id.toString()} />
        ))}
      </Picker>

      <Text style={styles.label}>Forma de Pagamento:</Text>
      <Picker
        selectedValue={selectedFormaPagamento}
        onValueChange={(itemValue) => setSelectedFormaPagamento(itemValue)}
        style={styles.picker}
      >
      {Array.isArray(formasPagamento) && formasPagamento.map((forma) => (
          <Picker.Item key={forma.id} label={forma.name} value={forma.id.toString()} />
        ))}
      </Picker>

      <Text style={styles.label}>Faixa Etária:</Text>
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

      <TouchableOpacity style={styles.button} onPress={handleEditarVenda}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  picker: {
    height: 150,
    backgroundColor: '#fff',
    marginBottom: 30,
    justifyContent: 'center', 
  },
  button: {
    backgroundColor: '#20B2AA',
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default VendasEditTab;
