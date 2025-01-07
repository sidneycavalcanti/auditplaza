import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const ListagemVendas = ({ route }) => {
  const { vendas } = route.params; // Recebe as vendas passadas pela navegação

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Últimas Vendas</Text>
      <FlatList
        data={vendas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>Valor: {item.valor}</Text>
            <Text>Data: {item.createdAt}</Text>
            <Text>Sexo: {item.sexoId}</Text>
            <Text>Forma de Pagamento: {item.formaPagamentoId}</Text>
          </View>
        )}
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
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderColor: '#ccc',
    borderWidth: 1,
  },
});

export default ListagemVendas;
