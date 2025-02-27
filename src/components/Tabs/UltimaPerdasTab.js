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

const UltimasPerdasTab = ({ auditoriaId, setActiveTab }) => {
  console.log("🔍 setActiveTab recebido:", setActiveTab);

  const [perdas, setPerdas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { fetchUltimasPerdas, excluirPerda } = useAuditoriaDetails();

  useEffect(() => {
    carregarPerdas(currentPage);
  }, [currentPage]);

  const carregarPerdas = async (page) => {

    try {
      setLoading(true)
      const response = await fetchUltimasPerdas(auditoriaId, page);

      setPerdas(response.perdas); // Garante que perdas não seja null
      setTotalPages(response.totalPages)
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
    <View style={styles.Item}>
      {/* Motivo e Descrição */}
      <View>
        <Text style={styles.valorText}> {item.motivoperdas?.name || 'Não informado'}</Text>
        <Text style={styles.obstext}>Observacão: {item.obs || 'Sem observação'}</Text>
      </View>

      {/* Botões de Ações */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.editButton} onPress={() => setActiveTab('PerdasEditTab', item)}>
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
        <ActivityIndicator size="large" color="#778899" />
      ) : perdas.length === 0 ? (
        <Text style={styles.emptyText}>Nenhuma perda cadastrada.</Text>
      ) : (

        <>
          <ScrollView nestedScrollEnabled={true}>
            <FlatList
              data={perdas || []}
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


export default UltimasPerdasTab;
