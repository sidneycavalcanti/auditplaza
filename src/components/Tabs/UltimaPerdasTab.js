import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import useAuditoriaDetails from '../../hooks/useAuditoriaDetails';

const UltimasPerdasTab = ({ auditoriaId, lojaName, data, userName }) => {
  const [perdas, setPerdas] = useState([]);
  const [loading, setLoading] = useState(true);

  const { fetchUltimasPerdas, excluirPerda } = useAuditoriaDetails();

  useEffect(() => {
    carregarPerdas();
  }, []);

  const carregarPerdas = async () => {
    try {
      const response = await fetchUltimasPerdas(auditoriaId);
      setPerdas(response || []); // Garante que perdas não seja null
    } catch (error) {
      console.error('Erro ao carregar perdas:', error);
      Alert.alert('Erro', 'Não foi possível carregar as últimas perdas.');
    } finally {
      setLoading(false);
    }
  };

  const handleExcluirPerda = (perdaId) => {
    Alert.alert(
      'Confirmação',
      'Deseja excluir esta perda?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          onPress: async () => {
            try {
              await excluirPerda(perdaId);
              setPerdas(perdas.filter((perda) => perda.id !== perdaId));
              Alert.alert('Sucesso', 'Perda excluída com sucesso!');
            } catch (error) {
              Alert.alert('Erro', 'Erro ao excluir a perda.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderPerda = ({ item }) => (
    <View style={styles.perdaItem}>
      <Text style={styles.valorText}>Motivo: {item.motivoperdasId.lojaName}</Text>
      <Text style={styles.valorText}>Descrição: {item.descricao}</Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleExcluirPerda(item.id)}
        >
          <Text style={styles.buttonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📋 Últimas Perdas</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#20B2AA" />
      ) : perdas.length === 0 ? (
        <Text style={styles.emptyText}>Nenhuma perda cadastrada.</Text>
      ) : (
        <FlatList
          data={perdas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPerda}
          nestedScrollEnabled={true} // Permite rolagem aninhada
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  perdaItem: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  valorText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
  deleteButton: {
    backgroundColor: '#F44336',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#777',
    marginTop: 20,
  },
});

export default UltimasPerdasTab;
