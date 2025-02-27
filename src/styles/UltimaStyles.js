import { StyleSheet } from 'react-native';

export default StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },

  loading: {
   color: "#778899"
  },


  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  Item: {
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
    backgroundColor: '#66CDAA',
    padding: 10,
    borderRadius: 10,
    marginRight: 5,
  },
  deleteButton: {
    backgroundColor: '#DC143C',
    padding: 10,
    borderRadius: 10,
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
    backgroundColor: '#778899',
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
  },
  obstext: {
    fontSize: 14,
    color: '#555',
    flexShrink: 1,
    flexWrap: 'wrap',
    textAlign: 'left',
    maxWidth: '60%',
  }

});
