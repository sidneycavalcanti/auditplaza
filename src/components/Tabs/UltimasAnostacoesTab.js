import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  FlatList,

} from 'react-native';

const UltimasAnotacoesTab = ({ route, navigation }) => {
  const { perdas } = route.params;

  const handleEdit = (perdas) => {
    console.log('Venda enviada para edição:', perdas); // Verifique os dados no console
    navigation.navigate('VendasEditTab', { perdas }); // Passa a venda inteira para edição
  };

  const handleExcluirPerdas = async (perdasId) => {
    try {
      // Lógica para excluir a venda
      await excluirVenda(perdasId); // Chame a função que faz a requisição para excluir
      Alert.alert('Sucesso', 'Venda excluída com sucesso!');
      // Atualize a lista de vendas ou recarregue os dados
      navigation.goBack(); // Volte para a lista de auditorias
    } catch (error) {
      console.error('Erro ao excluir venda:', error);
      Alert.alert('Erro', 'Não foi possível excluir a venda.');
    }
  };
  

  const renderPerdas= ({ item }) => (
    <View style={styles.vendaItem}>
      <Text style={styles.valorText}>Motivo: {item.valor}</Text>
      <View style={styles.buttonsContainer}>
      <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item)}>
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleExcluirPerdas(item.id)}
        >
          <Text style={styles.buttonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Últimas Perdas</Text>
      <FlatList
        data={perdas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPerdas}
        contentContainerStyle={styles.listContainer}
      />
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
  listContainer: {
    marginTop: 10,
  },
  vendaItem: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 2,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default UltimasAnotacoesTab;
