import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
  ScrollView
} from 'react-native';
import useAuditoriaDetails from '../../hooks/useAuditoriaDetails';

const UltimasPerdasTab = ({ auditoriaId, setActiveTab }) => {
  const [perdas, setPerdas] = useState([]);
  const [loading, setLoading] = useState(true);

  const { fetchUltimasPerdas, excluirPerda } = useAuditoriaDetails();

  useEffect(() => {
    carregarPerdas();
  }, []);

  const carregarPerdas = async () => {
    try {
      const response = await fetchUltimasPerdas(auditoriaId);

      const perdasOrdenadas = response.sort((a,b) => new Date (b.createdAt) - new Date(a.createdAt));

      setPerdas(perdasOrdenadas || []); // Garante que perdas não seja null
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
      {/* Motivo e Descrição */}
      <View>
        <Text style={styles.valorText}>Motivo: {item.motivoperdas?.name || 'Não informado'}</Text>
        <Text style={styles.obstext}>Descrição: {item.observacao || 'Sem observação'}</Text>
      </View>
  
      {/* Botões de Ações */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleEdit(item)}
        >
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
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
        <ScrollView nestedScrollEnabled={true}>
        <FlatList
          data={perdas || []}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPerda}
          scrollEnabled={false} // Impede que a FlatList role
          contentContainerStyle={styles.listContainer}
        />
      </ScrollView>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  valorText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  obstext: {
    fontSize: 14,
    color: '#555',
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
  editButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginRight: 5,
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
