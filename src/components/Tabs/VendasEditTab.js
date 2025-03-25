import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  Switch
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import useAuditoriaDetails from '../../hooks/useAuditoriaDetails';
import styles from '../../styles/AuditoriaScreenStyles';

const VendasEditTab = ({ venda, setActiveTab }) => {
  if (!venda) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Erro: Nenhuma venda selecionada.</Text>
      </View>
    );
  }

  const {
    fetchSexos,
    fetchFormasPagamento,
    atualizarVenda,
    formasPagamento,
    sexos,
    loading
  } = useAuditoriaDetails();

  // 🚀 Inicializa os estados corretamente
  const [valor, setValor] = useState(venda?.valor?.toString() || '');
  const [faixaEtaria, setFaixaEtaria] = useState(venda?.faixaetaria || 'adulto'); // 🔥 Garante que o valor padrão seja o correto
  const [selectedSexo, setSelectedSexo] = useState(venda?.sexo?.id?.toString() || '');
  const [selectedFormaPagamento, setSelectedFormaPagamento] = useState(venda?.formadepagamento?.id?.toString() || '');
  const [observacao, setObservacao] = useState(venda?.observacao || '');
  const [isTrocaChecked, setIsTrocaChecked] = useState(venda?.troca || false);

  // 🚀 Carregar listas de sexo e forma de pagamento
  useEffect(() => {
    const loadData = async () => {
      await fetchSexos();
      await fetchFormasPagamento();
    };
    loadData();
  }, []);

  // 🔍 Log para depuração
  useEffect(() => {
    console.log("📥 Venda recebida para edição:", venda);
    console.log("Sexos carregados:", sexos);
    console.log("Formas de pagamento carregadas:", formasPagamento);
  }, [venda, sexos, formasPagamento]);

  const handleEditarVenda = async () => {
    if (!valor || isNaN(Number(valor.replace(',', '.'))) || Number(valor.replace(',', '.')) <= 0) {
      Alert.alert('Por favor, insira um valor numérico válido.');
      return;
    }

    if (!selectedSexo) {
      Alert.alert('Selecione um sexo.');
      return;
    }

    if (!selectedFormaPagamento) {
      Alert.alert('Selecione uma forma de pagamento.');
      return;
    }

    if (!faixaEtaria) {
      Alert.alert('Selecione uma faixa etária.');
      return;
    }

    const vendaAtualizada = {
      id: venda.id,
      auditoriaId: venda.auditoriaId,
      formadepagamentoId: parseInt(selectedFormaPagamento, 10),
      sexoId: parseInt(selectedSexo, 10),
      valor: parseFloat(valor.replace(',', '.')),
      faixaetaria: faixaEtaria, // 🔥 Aqui garantimos que o valor correto seja enviado!
      observacao,
      troca: isTrocaChecked
    };

    console.log("📡 Enviando atualização da venda:", JSON.stringify(vendaAtualizada, null, 2));

    try {
      await atualizarVenda(vendaAtualizada);
      Alert.alert('Sucesso', 'Venda atualizada com sucesso!');
      setActiveTab('UltimasVendas'); // Retorna à lista de vendas
    } catch (err) {
      console.error("❌ Erro ao atualizar venda:", err);
      Alert.alert('Erro', 'Não foi possível atualizar a venda.');
    }
  };

  return (
    <ScrollView style={styles.contentContainer}>
      <Text style={styles.title}>📋 Editar Venda</Text>

      {loading && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginVertical: 10 }}>
          <ActivityIndicator size="large" color="#778899" />
          <Text>Carregando...</Text>
        </View>
      )}

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
            onValueChange={(itemValue) => {
              console.log("📝 Alterando faixaEtaria para:", itemValue);
              setFaixaEtaria(itemValue);
            }}
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
                trackColor={{ false: '#767577', true: '#778899' }}
                thumbColor={isTrocaChecked ? '#778899' : '#f4f3f4'}
              />
            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleEditarVenda}>
            <Text style={styles.buttonText}>Salvar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => setActiveTab('UltimasVendas')}>
            <Text style={styles.buttonText}>Voltar</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

export default VendasEditTab;
