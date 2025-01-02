import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { format, isToday, parseISO } from 'date-fns';
import useAuditorias from '../hooks/useAuditorias';

const HomeScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { auditorias, loading, error, fetchAuditorias } = useAuditorias();

  const handleAuditoria = (lojaId, lojaName) => {
    navigation.navigate('Auditoria', { lojaId, lojaName });
  };
  

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  // Ordenar auditorias e converter datas
  const sortedAuditorias = auditorias
    ?.map((item) => ({
      ...item,
      data: parseISO(item.data),
    }))
    .sort((a, b) => b.data - a.data);

  // Filtrar auditorias pelo texto de busca
  const filteredAuditorias = sortedAuditorias?.filter((item) =>
    item.loja?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderAuditoria = ({ item }) => {
    const isDisponivel = isToday(item.data);

    return (
    <View style={styles.auditoriaItem}>
      <Text style={styles.auditoriaText}>
        <Text style={styles.label}>Loja:</Text> {item.loja?.name || 'N/A'}
      </Text>
      <Text style={styles.auditoriaText}>
        <Text style={styles.label}>Data:</Text> {format(item.data, 'dd/MM/yyyy')}
      </Text>
      <Text style={styles.auditoriaText}>
        <Text style={styles.label}>Status:</Text> {isDisponivel ? 'Disponível' : 'Indisponível'}
      </Text>
      <TouchableOpacity
        style={[styles.button, isDisponivel ? styles.buttonAtivo : styles.buttonInativo]}
        disabled={!isDisponivel}
        onPress={() => handleAuditoria(item.id, item.loja?.name)}
      >
        <Text style={styles.buttonText}>
          {isDisponivel ? 'Iniciar Auditoria' : 'Indisponível'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        {/* Logo e título */}
        <Image style={styles.logo} source={require('../assets/logo.png')} />
        <Text style={styles.title}>Minhas Auditorias</Text>

        {/* Campo de busca */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Pesquisar auditorias por loja..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>

        {/* Botão de atualizar */}
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={fetchAuditorias}
          disabled={loading}
        >
          <Text style={styles.refreshButtonText}>
            {loading ? 'Atualizando...' : 'Atualizar'}
          </Text>
        </TouchableOpacity>

        {/* Indicador de carregamento */}
        {loading && <ActivityIndicator size="large" color="#20B2AA" />}

        {/* Mensagem de erro */}
        {error && <Text style={styles.errorText}>Erro ao buscar auditorias: {error}</Text>}

        {/* Lista de auditorias */}
        {!loading && !error && filteredAuditorias?.length > 0 ? (
          <FlatList
          data={filteredAuditorias}
          keyExtractor={(item) => item.id?.toString()}
          renderItem={renderAuditoria}
          contentContainerStyle={styles.listContainer}
          style={{ width: '100%' }} // Preenche toda a largura
          showsVerticalScrollIndicator={false}
        />
        ) : (
          !loading && !error && (
            <Text style={styles.noResultsText}>Nenhuma auditoria encontrada.</Text>
          )
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    alignItems: 'center',
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
    flexGrow: 1,
    paddingBottom: 20,
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
    width: '100%',
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
  buttonAtivo: {
    backgroundColor: '#20B2AA',
  },
  buttonInativo: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
  noResultsText: {
    fontSize: 16,
    color: '#999',
    marginTop: 20,
    textAlign: 'center',
  },
  refreshButton: {
    backgroundColor: '#20B2AA',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 20,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
