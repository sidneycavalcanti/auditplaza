import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import useAuditoriaDetails from '../../hooks/useAuditoriaDetails';

const UltimasVendasTab = ({ auditoriaId, lojaName, data, userName, navigation }) => {
  const [vendas, setVendas] = useState([]);
  const [loading, setLoading] = useState(true);

  const { fetchUltimasVendas, excluirVenda } = useAuditoriaDetails();

  // Carregar vendas ao abrir a aba
  useEffect(() => {
    carregarVendas();
  }, []);

  const carregarVendas = async () => {
    try {
      const response = await fetchUltimasVendas(auditoriaId);
      setVendas(response);
    } catch (error) {
      console.error('Erro ao carregar vendas:', error);
      Alert.alert('Erro', 'Não foi possível carregar as últimas vendas.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (venda) => {
    console.log('Venda enviada para edição:', venda);
    navigation.navigate('VendasEditTab', { venda });
  };

  const handleExcluirVenda = (vendaId) => {
    Alert.alert(
      'Confirmação',
      'Deseja excluir esta venda?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          onPress: async () => {
            try {
              await excluirVenda(vendaId);
              setVendas(vendas.filter((venda) => venda.id !== vendaId));
              Alert.alert('Sucesso', 'Venda excluída com sucesso!');
            } catch (error) {
              console.error('Erro ao excluir venda:', error);
              Alert.alert('Erro', 'Erro ao excluir a venda.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderVenda = ({ item }) => (
    <View style={styles.vendaItem}>
      <View>
        <Text style={styles.valorText}>
          Valor: R$ {item.valor ? Number(item.valor).toFixed(2) : '0.00'}
        </Text>

        <Text style={styles.dataText}>Data: {new Date(item.createdAt).toLocaleString()}</Text>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item)}>
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleExcluirVenda(item.id)}
        >
          <Text style={styles.buttonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📋 Últimas Vendas</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#20B2AA" />
      ) : vendas.length === 0 ? (
        <Text style={styles.emptyText}>Nenhuma venda cadastrada.</Text>
      ) : (
        <ScrollView nestedScrollEnabled={true}>
          <FlatList
            data={vendas}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderVenda}
            scrollEnabled={false}  // 🔑 Evita conflito de rolagem
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
  header: {
    backgroundColor: '#20B2AA',
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
  },
  headerText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  vendaItem: {
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
  dataText: {
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

export default UltimasVendasTab;
