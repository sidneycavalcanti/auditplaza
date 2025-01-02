import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

const AuditoriaScreen = ({ route }) => {
  const [activeTab, setActiveTab] = useState('Vendas'); // Aba ativa
  const navigation = useNavigation(); // Navegação para outras telas
  const { lojaName } = route.params || { lojaName: 'Nome da Loja' }; // Nome da loja vindo da rota ou padrão

  // Verificar a autenticação do usuário
  const checkAuthentication = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      Alert.alert('Sessão expirada', 'Por favor, faça login novamente.');
      navigation.navigate('Login');
    }
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  const [selectedReason, setSelectedReason] = useState('');
  const [observation, setObservation] = useState('');
  const [losses, setLosses] = useState([]);
  const [annotations, setAnnotations] = useState([]);
  const [annotation, setAnnotation] = useState('');

  const addLoss = () => {
    if (!selectedReason || !observation) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }
    setLosses([...losses, { reason: selectedReason, observation }]);
    setSelectedReason('');
    setObservation('');
  };

  const addAnnotation = () => {
    if (!annotation) {
      Alert.alert('Erro', 'Preencha o campo de anotações.');
      return;
    }
    setAnnotations([...annotations, annotation]);
    setAnnotation('');
  };
  

  // Componentes para as abas
  const VendasTab = () => (
    <View style={styles.contentContainer}>
      <Text style={styles.sectionTitle}>Valor</Text>
      <TextInput style={styles.input} placeholder="Digite o valor das vendas" />

      <Text style={styles.sectionTitle}>Sexo</Text>
      <TextInput style={styles.input} placeholder="Masculino/Feminino" placeholderTextColor="#888" />

      <Text style={styles.sectionTitle}>Forma de Pagamento:</Text>
      <TextInput style={styles.input} placeholder="Digite a forma de pagamento" placeholderTextColor="#888" />

      <Text style={styles.sectionTitle}>Faixa Etária:</Text>
      <TextInput style={styles.input} placeholder="Ex: 18-25, 26-35" placeholderTextColor="#888" />

      <Text style={styles.sectionTitle}>Observação:</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Digite suas observações"
        placeholderTextColor="#888"
        multiline
        numberOfLines={4}
      />

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Adicionar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Últimas Vendas</Text>
      </TouchableOpacity>
    </View>
  );

  const FluxoTab = () => {
    const [fluxo, setFluxo] = useState({
      masculino: { especulador: 0, acompanhante: 0, outros: 0 },
      feminino: { especulador: 0, acompanhante: 0, outros: 0 },
    });
  
    const handleIncrement = (gender, type) => {
      setFluxo((prevState) => ({
        ...prevState,
        [gender]: {
          ...prevState[gender],
          [type]: prevState[gender][type] + 1,
        },
      }));
    };
  
    const handleDecrement = (gender, type) => {
      setFluxo((prevState) => ({
        ...prevState,
        [gender]: {
          ...prevState[gender],
          [type]: Math.max(0, prevState[gender][type] - 1), // Não permite valores negativos
        },
      }));
    };
  
    return (
      <View style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>Fluxo de Pessoas</Text>
  
        {/* Cabeçalhos */}
        <View style={styles.headerRow}>
          <Text style={styles.headerText}>Masculino</Text>
          <Text style={styles.headerText}>Feminino</Text>
        </View>
  
        {/* Categorias */}
        {['especulador', 'acompanhante', 'outros'].map((category) => (
          <View key={category} style={styles.row}>
            {/* Masculino */}
            <View style={styles.counterGroup}>
              <Text style={styles.label}>{capitalizeFirstLetter(category)}</Text>
              <View style={styles.counterContainer}>
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => handleDecrement('masculino', category)}
                >
                  <Text style={styles.counterButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.counterValue}>{fluxo.masculino[category]}</Text>
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => handleIncrement('masculino', category)}
                >
                  <Text style={styles.counterButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
  
            {/* Feminino */}
            <View style={styles.counterGroup}>
              <Text style={styles.label}>{capitalizeFirstLetter(category)}</Text>
              <View style={styles.counterContainer}>
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => handleDecrement('feminino', category)}
                >
                  <Text style={styles.counterButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.counterValue}>{fluxo.feminino[category]}</Text>
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => handleIncrement('feminino', category)}
                >
                  <Text style={styles.counterButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
  
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Salvar Fluxo</Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  const PerdasTab = () => (
    <View style={styles.contentContainer}>
      <Text style={styles.sectionTitle}>Motivo da Perda</Text>
      <Picker
        selectedValue={selectedReason}
        onValueChange={(itemValue) => setSelectedReason(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Selecione um motivo" value="" />
        <Picker.Item label="Quebra" value="Quebra" />
        <Picker.Item label="Desperdício" value="Desperdício" />
        <Picker.Item label="Outro" value="Outro" />
      </Picker>

      <Text style={styles.sectionTitle}>Observação</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Digite suas observações"
        placeholderTextColor="#888"
        multiline
        numberOfLines={4}
        value={observation}
        onChangeText={setObservation}
      />

      <TouchableOpacity style={styles.button} onPress={addLoss}>
        <Text style={styles.buttonText}>Gravar</Text>
      </TouchableOpacity>

      <FlatList
        data={losses}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.listText}>Motivo: {item.reason}</Text>
            <Text style={styles.listText}>Observação: {item.observation}</Text>
          </View>
        )}
      />
    </View>
  );

  const AnotacoesTab = () => (
    <View style={styles.contentContainer}>
      <Text style={styles.sectionTitle}>Anotações</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Digite suas anotações"
        placeholderTextColor="#888"
        multiline
        numberOfLines={4}
        value={annotation}
        onChangeText={setAnnotation}
      />

      <TouchableOpacity style={styles.button} onPress={addAnnotation}>
        <Text style={styles.buttonText}>Gravar</Text>
      </TouchableOpacity>

      <FlatList
        data={annotations}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.listText}>{item}</Text>
          </View>
        )}
      />
    </View>
  );

  const OutrosTab = () => (
    <View style={styles.contentContainer}>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Pausa</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Operacional</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Calculadora</Text>
      </TouchableOpacity>
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'Vendas':
        return <VendasTab />;
      case 'Fluxo':
        return <FluxoTab />;
      case 'Perdas':
        return <PerdasTab />;
      case 'Anotações':
        return <AnotacoesTab />;
      case 'Outros':
        return <OutrosTab />;
      default:
        return <VendasTab />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Barra com o nome da loja */}
      <View style={styles.header}>
        <Text style={styles.headerText}>{lojaName}</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {['Vendas', 'Perdas', 'Fluxo', 'Anotações', 'Outros'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabButton, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Conteúdo da aba */}
      <ScrollView style={styles.scrollContainer}>{renderContent()}</ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#20B2AA',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#ddd',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#20B2AA',
  },
  tabText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  activeTabText: {
    color: '#20B2AA',
  },
  contentContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    borderColor: '#ccc',
    borderWidth: 1,
    fontSize: 16,
  },
  textArea: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 15,
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
  picker: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 15,
  },
  listItem: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 10,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  listText: {
    fontSize: 14,
    color: '#333',
  },
});

export default AuditoriaScreen;
