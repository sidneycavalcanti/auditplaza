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

const UltimasVendasTab = ({ auditoriaId, setActiveTab }) => {
  console.log("🔍 setActiveTab recebido:", setActiveTab);

  const [vendas, setVendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { fetchUltimasVendas, excluirVenda } = useAuditoriaDetails();

  useEffect(() => {
    carregarVendas(currentPage);
  }, [currentPage]);

  const carregarVendas = async (page) => {
    try {
      setLoading(true);
      const response = await fetchUltimasVendas(auditoriaId, page);
      
      setVendas(response.vendas);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Erro ao carregar vendas:', error);
      Alert.alert('Erro', 'Não foi possível carregar as últimas vendas.');
    } finally {
      setLoading(false);
    }
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
        <TouchableOpacity style={styles.editButton} onPress={() => setActiveTab('VendasEditTab', item)}>
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
        <>
          {/* ✅ Remova o ScrollView, pois FlatList já lida com rolagem */}
          <ScrollView nestedScrollEnabled={true}>
          <FlatList
            data={vendas}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderVenda}
            scrollEnabled={false} // Impede que a FlatList role
            contentContainerStyle={styles.listContainer} // Mantém um espaçamento adequado
          />
          </ScrollView>
          
          {/* 🔥 Botões de Paginação */}
          <View style={styles.paginationContainer}>
            <TouchableOpacity
              style={[styles.pageButton, currentPage === 1 && styles.disabledButton]}
              onPress={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <Text style={styles.buttonText}>Anterior</Text>
            </TouchableOpacity>

            <Text style={styles.pageInfo}>Página {currentPage} de {totalPages}</Text>

            <TouchableOpacity
              style={[styles.pageButton, currentPage === totalPages && styles.disabledButton]}
              onPress={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <Text style={styles.buttonText}>Próxima</Text>
            </TouchableOpacity>
          </View>
        </>
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
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  pageButton: {
    backgroundColor: '#20B2AA',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  disabledButton: {
    backgroundColor: '#B0C4DE',
  },
  pageInfo: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContainer: {
    paddingBottom: 20, // Evita que o último item fique cortado
  }
});

export default UltimasVendasTab;
