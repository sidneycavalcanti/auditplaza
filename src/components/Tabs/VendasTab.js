import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import styles from '../../styles/AuditoriaScreenStyles';
import useAuditoriaDetails from '../../hooks/useAuditoriaDetails';


const VendasTab = ({ auditoriaId, userId, LojaId }) => {

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


   // Carregar dados necessários ao montar o componente
 useEffect(() => {
  fetchSexos();
  fetchFormasPagamento();
}, []);

useEffect(() => {
  console.log('Sexos:', sexos);
  console.log('Formas de Pagamento:', formasPagamento);
}, [sexos, formasPagamento]);


const handleAdicionarVenda = async () => {
  if (!valor || !selectedSexo || !selectedFormaPagamento || !faixaEtaria) {
    Alert.alert('Erro', 'Todos os campos devem ser preenchidos.');
    return;
  }

  const venda = {
    valor,
    faixaEtaria,
    sexoId: selectedSexo,
    formaPagamentoId: selectedFormaPagamento,
    auditoriaId,
    usuarioId: userId,
    lojaId,
  };

  try {
    console.log('Enviando venda:', venda); // Log do objeto enviado
    await cadastrarVenda(venda); // Enviar venda
    Alert.alert('Sucesso', 'Venda cadastrada com sucesso!');
  } catch (err) {
    console.error('Erro ao salvar venda:', err); // Log de erro
    Alert.alert('Erro', 'Não foi possível salvar a venda.');
  }
};

  const [isTrocaChecked, setIsTrocaChecked] = useState(false); // Estado para "Troca"
  const [isViradaChecked, setIsViradaChecked] = useState(false); // Estado para "Virada"

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

<Picker
  selectedValue={selectedSexo}
  onValueChange={(itemValue) => setSelectedSexo(itemValue)}
  style={styles.picker}
>
  <Picker.Item label="Selecione o sexo" value="" />
  {Array.isArray(sexos) &&
    sexos.map((sexo) => (
      <Picker.Item key={sexo.id} label={sexo.name} value={sexo.id} />
    ))}
</Picker>

<Picker
  selectedValue={selectedFormaPagamento}
  onValueChange={(itemValue) => setSelectedFormaPagamento(itemValue)}
  style={styles.picker}
>
  <Picker.Item label="Selecione a forma de pagamento" value="" />
  {Array.isArray(formasPagamento) &&
    formasPagamento.map((forma) => (
      <Picker.Item key={forma.id} label={forma.name} value={forma.id} />
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

      <TouchableOpacity style={styles.button} onPress={handleAdicionarVenda}>
        <Text style={styles.buttonText}>
          {loading ? 'Adicionando...' : 'Adicionar'}
        </Text>
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default VendasTab;
