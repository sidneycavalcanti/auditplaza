import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { format } from 'date-fns';

const HomeScreen = ({ navigation }) => { // Recebendo a prop navigation
  const [searchQuery, setSearchQuery] = useState('');
  const [auditorias] = useState([
    { id: '1', loja: 'Loja 1', data: new Date(), status: 'Disponível' },
    { id: '2', loja: 'Loja 2', data: new Date(), status: 'Pendente' },
    { id: '3', loja: 'Loja 3', data: new Date(), status: 'Disponível' },
  ]);

  const handleAuditoria = (lojaId) => {
    // Redireciona para a tela de Auditoria, passando o ID da loja como parâmetro
    navigation.navigate('Auditoria', { lojaId }); // Agora funciona corretamente
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  const filteredAuditorias = auditorias.filter((item) =>
    item.loja.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderAuditoria = ({ item }) => (
    <View style={styles.auditoriaItem}>
      <Text style={styles.auditoriaText}>
        <Text style={styles.label}>Loja:</Text> {item.loja}
      </Text>
      <Text style={styles.auditoriaText}>
        <Text style={styles.label}>Data:</Text> {format(new Date(item.data), 'dd/MM/yyyy')}
      </Text>
      <Text style={styles.auditoriaText}>
        <Text style={styles.label}>Status:</Text> {item.status}
      </Text>

      <TouchableOpacity
        style={[
          styles.button,
          item.status === 'Disponível'
            ? { backgroundColor: '#20B2AA' }
            : { backgroundColor: '#ccc' },
        ]}
        disabled={item.status !== 'Disponível'}
        onPress={() => handleAuditoria(item.id)} // Passa o ID da loja ao clicar
      >
        <Text style={styles.buttonText}>Iniciar Auditoria</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image style={styles.logo} source={require('../assets/logo.png')} />

      {/* Título */}
      <Text style={styles.title}>Auditorias</Text>

      {/* Campo de Pesquisa */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Pesquisar auditorias..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {/* Lista de Auditorias */}
      <FlatList
        data={filteredAuditorias}
        keyExtractor={(item) => item.id}
        renderItem={renderAuditoria}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#20B2AA',
    marginBottom: 10,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#ffffff',
    borderRadius: 25,
    paddingHorizontal: 15,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  listContainer: {
    width: '100%',
  },
  auditoriaItem: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  auditoriaText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  label: {
    fontWeight: 'bold',
    color: '#555',
  },
  button: {
    width: '100%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
