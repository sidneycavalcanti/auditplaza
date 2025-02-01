import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import useAuditoriaDetails from '../../hooks/useAuditoriaDetails';

import styles from '../../styles/AuditoriaScreenStyles';

const VendasTab = ({ auditoriaId, userId, lojaId, setActiveTab }) => {
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
  const [faixaEtaria, setFaixaEtaria] = useState('adulto'); // Default faixa etária
  const [selectedSexo, setSelectedSexo] = useState('');
  const [selectedFormaPagamento, setSelectedFormaPagamento] = useState('');
  const [observacao, setObservacao] = useState('');
  const [isTrocaChecked, setIsTrocaChecked] = useState(false); // Estado para "Troca"

  // Carregar dados necessários ao montar o componente
  useEffect(() => {
    fetchSexos();
    fetchFormasPagamento();
  }, []);

  useEffect(() => {
    console.log('Loja ID:', lojaId); // Verifique se o ID está correto
  }, [lojaId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#20B2AA" />
        <Text>Carregando informações...</Text>
      </View>
    );
  }

  const handleAdicionarVenda = async () => {
    // Validação dos campos
    if (!valor || isNaN(Number(valor.replace(',', '.'))) || Number(valor.replace(',', '.')) <= 0) {
      Alert.alert('Erro', 'Por favor, insira um valor numérico válido no formato 10.20 ou 10,20.');
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
  
    // Converte o valor para número
    const valorNumerico = parseFloat(valor.replace(',', '.'));
  
    // Objeto de venda
    const venda = {
      valor: valorNumerico,
      faixaetaria: faixaEtaria, // 🔥 Certifique-se de que está correto
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
    <View style={styles.contentContainer}>
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
    </View>
  );
};

export default VendasTab;
