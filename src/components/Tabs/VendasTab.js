import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  StyleSheet,
  Switch,
  ActivityIndicator
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import useAuditoriaDetails from '../../hooks/useAuditoriaDetails';

const VendasTab = ({ auditoriaId, userId, lojaId }) => {
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
  

  // Função para buscar e listar as últimas vendas
  const handleUltimasVendas = async () => {
    try {
      const vendas = await fetchUltimasVendas(); // Chama o hook para buscar as vendas
      console.log('Últimas vendas:', vendas); // Log das vendas (para debug)

      // Opcional: Exibir as vendas em um alert ou console
      Alert.alert('Últimas vendas', vendas.map(v => `Valor: ${v.valor}, Data: ${v.createdAt}`).join('\n'));
    } catch (error) {
      console.error('Erro ao listar vendas:', error);
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


const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
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
    height: Platform.OS === 'ios' ? 200 : 50,
    backgroundColor: Platform.OS === 'ios' ? '#f9f9f9' : '#fff',
    borderRadius: Platform.OS === 'ios' ? 10 : 0,
    borderWidth: Platform.OS === 'ios' ? 1 : 0,
    borderColor: '#ccc',
    marginBottom: 15,
  },
  checkboxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  switchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#20B2AA',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
});

export default VendasTab;
