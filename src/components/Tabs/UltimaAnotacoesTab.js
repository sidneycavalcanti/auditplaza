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

const UltimaAnotacoesTab = ({ auditoriaId, setActiveTab }) => {
  console.log("🔍 setActiveTab recebido:", setActiveTab);

  const [anotacoes, setAnotacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { fetchUltimasAnotacoes, excluirAnotacao } = useAuditoriaDetails();

  useEffect(() => {
    carregarAnotacoes(currentPage);
  }, [currentPage]);

  const carregarAnotacoes = async (page) => {
    try {
      setLoading(true);
      const response = await fetchUltimasAnotacoes(auditoriaId, page);

      if (response && response.anotacoes) {
        setAnotacoes(response.anotacoes); // ✅ Corrigido: Atualizar anotações corretamente
        setTotalPages(response.totalPages);
      } else {
        setAnotacoes([]); // Se não houver anotações, define como um array vazio
      }
    } catch (error) {
      console.error('❌ Erro ao carregar anotações:', error);
      Alert.alert('Erro', 'Não foi possível carregar as últimas anotações.');
    } finally {
      setLoading(false);
    }
  };

  const handleExcluirAnotacao = (anotacaoId) => {
    Alert.alert(
      'Confirmação',
      'Deseja excluir esta anotação?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          onPress: async () => {
            try {
              await excluirAnotacao(anotacaoId);
              setAnotacoes(anotacoes.filter((anotacao) => anotacao.id !== anotacaoId));
              Alert.alert('Sucesso', 'Anotação excluída com sucesso!');
            } catch (error) {
              Alert.alert('Erro', 'Erro ao excluir a anotação.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderAnotacao = ({ item }) => (
    <View style={styles.anotacaoItem}>
      {/* Descrição da Anotação */}
      <View>
        <Text style={styles.valorText}>Descrição:</Text>
        <Text style={styles.obstext}>{item.descricao || 'Sem descrição'}</Text>
      </View>

      {/* Botões de Ações */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleExcluirAnotacao(item.id)}>
          <Text style={styles.buttonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📋 Últimas Anotações</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#20B2AA" />
      ) : anotacoes.length === 0 ? (
        <Text style={styles.emptyText}>Nenhuma anotação cadastrada.</Text>
      ) : (
        <>
          <ScrollView nestedScrollEnabled={true}>
            <FlatList
              data={anotacoes}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderAnotacao}
              scrollEnabled={false} // Impede que a FlatList role
              contentContainerStyle={styles.listContainer}
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
  anotacaoItem: {
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
    flexShrink: 1,
    flexWrap: 'wrap',
    textAlign: 'left',
    maxWidth: '60%',
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
});

export default UltimaAnotacoesTab;
