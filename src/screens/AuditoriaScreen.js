import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const AuditoriaScreen = () => {
  const [activeTab, setActiveTab] = useState('Vendas'); // Aba ativa
  const navigation = useNavigation(); // Navegação para outras telas

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

      {/* Checkboxes */}
      <View style={styles.checkboxContainer}>
        <TouchableOpacity style={styles.checkbox}>
          <Text style={styles.checkboxText}>Troca</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.checkbox}>
          <Text style={styles.checkboxText}>Virada</Text>
        </TouchableOpacity>
      </View>

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

  const capitalizeFirstLetter = (string) =>
    string.charAt(0).toUpperCase() + string.slice(1);

  const renderContent = () => {
    switch (activeTab) {
      case 'Vendas':
        return <VendasTab />;
      case 'Fluxo':
        return <FluxoTab />;
      default:
        return <VendasTab />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        {['Vendas', 'Fluxo', 'Perdas', 'Anotações', 'Outros'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabButton, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView style={styles.scrollContainer}>{renderContent()}</ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  // Todos os estilos usados anteriormente...
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  checkboxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  checkboxText: {
    fontSize: 16,
    marginLeft: 5,
    color: '#333',
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
   headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  counterGroup: {
    flex: 1,
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
    color: '#333',
  },
  counterGroup: {
    flex: 1,
    alignItems: 'center',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  counterButton: {
    backgroundColor: '#20B2AA',
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  counterValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
 
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
});

export default AuditoriaScreen;
