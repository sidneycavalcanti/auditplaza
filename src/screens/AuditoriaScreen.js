import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const AuditoriaScreen = () => {
  const [activeTab, setActiveTab] = useState('Vendas'); // Define a aba ativa
  const navigation = useNavigation(); // Para redirecionar o usuário

  // Verificar a autenticação e validade do token
  const checkAuthentication = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        Alert.alert('Sessão expirada', 'Por favor, faça login novamente.');
        navigation.navigate('Login');
        return;
      }

      // Validar o token com o backend
      const response = await axios.post('http://192.168.10.105:3000/auth/validate', { token });

      if (!response.data.valid) {
        Alert.alert('Sessão expirada', 'Por favor, faça login novamente.');
        navigation.navigate('Login');
      }
    } catch (error) {
      console.error('Erro na validação do token:', error);
      Alert.alert('Erro', 'Houve um problema com a autenticação. Faça login novamente.');
      navigation.navigate('Login');
    }
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  // Componentes das abas
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
      <TextInput style={styles.textArea} placeholder="Digite suas observações" placeholderTextColor="#888" multiline numberOfLines={4} />

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

  // Outras abas omitidas para simplicidade...

  // Renderização das abas
  const renderContent = () => {
    switch (activeTab) {
      case 'Vendas':
        return <VendasTab />;
      // Adicione os outros cases para as abas
      default:
        return <VendasTab />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Menu de Abas */}
      <View style={styles.tabsContainer}>
        {['Vendas', 'Fluxo', 'Perdas', 'Anotações', 'Outros'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabButton, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={styles.tabText}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Conteúdo da Aba Selecionada */}
      <ScrollView>{renderContent()}</ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  // ... estilos do seu código original
});

export default AuditoriaScreen;
