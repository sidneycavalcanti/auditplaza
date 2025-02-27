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

import styles from '../../styles/UltimaStyles';

const UltimasAvaliacaoTab = ({ auditoriaId, setActiveTab }) => {
  const [avaliacao, setAvaliacao] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Importa a função de busca e exclusão
  const { fetchUltimasAvaliacoes, excluirAvaliacao } = useAuditoriaDetails();

  // Carrega as avaliações ao montar o componente ou mudar de página
  useEffect(() => {
    carregarAvaliacoes(currentPage);
  }, [currentPage]);

 // ...
const carregarAvaliacoes = async (page) => {
  try {
    setLoading(true);
    const response = await fetchUltimasAvaliacoes(auditoriaId, page);
    // Esperamos { avaliacoes: [...], totalPages, ... }
    setAvaliacao(response.avaliacoes || []);
    setTotalPages(response.totalPages || 1);
  } catch (error) {
    console.error("Erro ao carregar avaliações:", error);
    Alert.alert("Erro", "Não foi possível carregar as últimas avaliações.");
  } finally {
    setLoading(false);
  }
};
// ...

  

  const handleExcluirAvaliacao = (avaliacaoId) => {
    Alert.alert(
      'Confirmação',
      'Deseja excluir esta avaliação?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          onPress: async () => {
            try {
              await excluirAvaliacao(avaliacaoId);
              setAvaliacao((prev) =>
                prev.filter((item) => item.id !== avaliacaoId)
              );
              Alert.alert('Sucesso', 'Avaliação excluída com sucesso!');
            } catch (error) {
              Alert.alert('Erro', 'Erro ao excluir a avaliação.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderAvaliacao = ({ item }) => (
    <View style={styles.Item}>
      {/* Pergunta e Resposta */}
      <View style={{ flex: 1, marginRight: 10 }}>
      <Text style={styles.valorText}>
  Pergunta: {item.cadavoperacional?.descricao || 'Não informada'}
</Text>
        <Text style={styles.obstext}>
          Resposta: {item.resposta || 'Sem resposta'}
        </Text>
      </View>

      {/* Botões de Ações */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setActiveTab('AvaliacoesEditTab', item)}
        >
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleExcluirAvaliacao(item.id)}
        >
          <Text style={styles.buttonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📋 Últimas Avaliações</Text>

      {loading ? (
        <ActivityIndicator size="large"  color="#778899"  />
      ) : avaliacao.length === 0 ? (
        <Text style={styles.emptyText}>Nenhuma avaliação cadastrada.</Text>
      ) : (
        <>
          <ScrollView nestedScrollEnabled={true}>
            <FlatList
              data={avaliacao}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderAvaliacao}
              scrollEnabled={false} // O ScrollView controla a rolagem
              contentContainerStyle={styles.listContainer}
            />
          </ScrollView>

          {/* Paginação */}
          <View style={styles.paginationContainer}>
            <TouchableOpacity
              style={[
                styles.pageButton,
                currentPage === 1 && styles.disabledButton
              ]}
              onPress={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <Text style={styles.buttonText}>Anterior</Text>
            </TouchableOpacity>

            <Text style={styles.pageInfo}>
              Página {currentPage} de {totalPages}
            </Text>

            <TouchableOpacity
              style={[
                styles.pageButton,
                currentPage === totalPages && styles.disabledButton
              ]}
              onPress={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
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


/*
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
  avaliacaoItem: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  valorText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  obstext: {
    fontSize: 14,
    color: '#555',
    flexWrap: 'wrap',
    textAlign: 'left',
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
  listContainer: {
    paddingBottom: 10,
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
*/

export default UltimasAvaliacaoTab;
