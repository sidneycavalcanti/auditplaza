import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Switch,
  ActivityIndicator
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

import useAuditoriaDetails from '../../hooks/useAuditoriaDetails';

import { useNavigation } from '@react-navigation/native';

import styles from '../../styles/AuditoriaScreenStyles';

const VendasTab = ({ auditoriaId, userId, lojaId }) => {

  const navigation = useNavigation();
  
  const {
    fetchSexos,
    fetchFormasPagamento,
    fetchUltimasVendas,
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
  const [isTrocaChecked, setIsTrocaChecked] = useState(false); // Estado para "Troca"
  const [isViradaChecked, setIsViradaChecked] = useState(false); // Estado para "Virada"

  

  // Carregar dados necessários ao montar o componente
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
    console.log('Objeto venda:', {
      valor: parseFloat(valor.replace(',', '.')),
      faixaEtaria,
      sexoId: parseInt(selectedSexo),
      formadepagamentoId: parseInt(selectedFormaPagamento),
      auditoriaId: parseInt(auditoriaId),
      usuarioId: parseInt(userId),
      lojaId: parseInt(lojaId),
    });
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
  
    // Converte o valor para formato numérico adequado
    const valorNumerico = parseFloat(valor.replace(',', '.')); // Substitui vírgula por ponto
  
    // Objeto de venda
    const venda = {
      valor: valorNumerico,
      faixaEtaria,
      sexoId: parseInt(selectedSexo), // Converte ID para número
      formadepagamentoId: parseInt(selectedFormaPagamento), // Converte ID para número
      auditoriaId: parseInt(auditoriaId), // Certifique-se de que auditoriaId é válido
      usuarioId: parseInt(userId), // Certifique-se de que userId é válido
      lojaId: parseInt(lojaId), // Certifique-se de que lojaId é válido
      //troca: isTrocaChecked,
      //virada: isViradaChecked,
    };
  
    console.log('Objeto venda enviado:', venda); // Verifique os dados no console

  
    try {
      // Envia a venda para a API
      await cadastrarVenda(venda);
      Alert.alert('Sucesso', 'Venda cadastrada com sucesso!');
  
      // Reseta os campos após sucesso
      setValor('');
      setSelectedSexo('');
      setSelectedFormaPagamento('');
      setFaixaEtaria('adulto');
      setIsTrocaChecked(false);
      setIsViradaChecked(false);
  
      // Opcional: Redirecione para a página de vendas ou atualize a lista
    } catch (err) {
      console.error('Erro ao salvar venda:', err);
      Alert.alert('Erro', 'Não foi possível salvar a venda.');
    }
  };
  

  // Função para buscar e listar as últimas vendas de uma auditoria específica
  {/* const handleUltimasVendas = async () => {
    try {
      const vendas = await fetchUltimasVendas(auditoriaId); // Passe o auditoriaId como parâmetro
  
      // Verifique se as vendas foram retornadas
      if (!vendas || vendas.length === 0) {
        Alert.alert('Sem Vendas', 'Não há vendas cadastradas para esta auditoria.');
        return;
      }
  
      // Mostre as vendas no Alert
      Alert.alert(
        'Últimas Vendas',
        vendas
          .map((v) => `Valor: ${v.valor}, Data: ${new Date(v.createdAt).toLocaleString()}`)
          .join('\n')
      );
    } catch (error) {
      console.error('Erro ao listar vendas:', error.message);
      Alert.alert('Erro', 'Não foi possível listar as últimas vendas.');
    }
  };*/}

  const handleUltimasVendas = async () => {
    try {
      const vendas = await fetchUltimasVendas(auditoriaId); // Passe o auditoriaId como parâmetro
  
      // Verifique se as vendas foram retornadas
      if (!vendas || vendas.length === 0) {
        Alert.alert('Sem Vendas', 'Não há vendas cadastradas para esta auditoria.');
        return;
      }
  
      // Renderiza uma nova tela ou modal com as vendas
      navigation.navigate('UltimasVendas', { vendas });
    } catch (error) {
      console.error('Erro ao listar vendas:', error.message);
      Alert.alert('Erro', 'Não foi possível listar as últimas vendas.');
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
        selectedValue={String(selectedSexo)}
        onValueChange={(itemValue) => setSelectedSexo(String(itemValue))}
        style={styles.picker}
      >
        <Picker.Item label="Selecione o sexo" value="" />
        {sexos.map((sexo) => (
          <Picker.Item key={sexo.id} label={sexo.name} value={String(sexo.id)} />
        ))}
      </Picker>

      <Text style={styles.sectionTitle}>Forma de Pagamento:</Text>
      <Picker
        selectedValue={String(selectedFormaPagamento)}
        onValueChange={(itemValue) => setSelectedFormaPagamento(String(itemValue))}
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
        <View style={styles.switchWrapper}>
          <Text>Virada</Text>
          <Switch
            value={isViradaChecked}
            onValueChange={setIsViradaChecked}
            trackColor={{ false: '#767577', true: '#20B2AA' }}
            thumbColor={isViradaChecked ? '#20B2AA' : '#f4f3f4'}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleAdicionarVenda}>
        <Text style={styles.buttonText}>
          {loading ? 'Adicionando...' : 'Adicionar'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleUltimasVendas}>
        <Text style={styles.buttonText}>
          {loading ? 'Abrindo ultimas vendas...' : 'Ultimas vendas'}
        </Text>
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default VendasTab;
