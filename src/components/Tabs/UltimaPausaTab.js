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

const UltimasPausaTab = ({ auditoriaId, setActiveTab }) => {
  console.log("🔍 setActiveTab recebido:", setActiveTab);

  const [pausas, setPausas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { fetchUltimasPausas, excluirPausa} = useAuditoriaDetails();

  useEffect(() => {
    carregarPausas(currentPage);
  }, [currentPage]);

  const carregarPausas = async (page) => {

    try {
      setLoading(true)
      const response = await fetchUltimasPausas(auditoriaId, page);

      setPausas(response.pausas); // Garante que pausas não seja null
      setTotalPages(response.totalPages)
    } catch (error) {
      console.error('Erro ao carregar pausas:', error);
      Alert.alert('Erro', 'Não foi possível carregar as últimas pausas.');
    } finally {
      setLoading(false);
    }
  };

  const handleExcluirPausa = (pausaId) => {
    Alert.alert(
      'Confirmação',
      'Deseja excluir esta pausa?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          onPress: async () => {
            try {
              await excluirPausa(pausaId);
              setPausas(pausas.filter((pausa) => pausa.id !== pausaId));
              Alert.alert('Sucesso', 'Pausa excluída com sucesso!');
            } catch (error) {
              Alert.alert('Erro', 'Erro ao excluir a pausa.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderPerda = ({ item }) => (
    <View style={styles.Item}>
      {/* Motivo e Descrição */}
      <View>
        <Text style={styles.valorText}> {item.motivodepausa?.name || 'Não informado'}</Text>
      </View>

      {/* Tempo da Pausa */}
  
      <Text style={styles.valorText}>
        ⏳ Tempo: {item.tempoGasto || 'Calculando...'}
      </Text>
   

      {/* Botões de Ações 
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.editButton} onPress={() => setActiveTab('PausasEditTab', item)}>
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleExcluirPausa(item.id)}
        >
          <Text style={styles.buttonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
      */}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📋 Últimas Pausas</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#778899"  />
      ) : pausas.length === 0 ? (
        <Text style={styles.emptyText}>Nenhuma perda cadastrada.</Text>
      ) : (

        <>
          <ScrollView nestedScrollEnabled={true}>
            <FlatList
              data={pausas || []}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderPerda}
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
    flexShrink: 1, // 🔥 Permite que o texto quebre sem aumentar o tamanho do container
    flexWrap: 'wrap', // 🔥 Quebra a linha corretamente
    textAlign: 'left', // 🔥 Mantém um alinhamento legível
    maxWidth: '60%', // 🔥 Garante que o texto ocupe no máximo 70% do espaço e não empurre os botões
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
});
*/
export default UltimasPausaTab;
