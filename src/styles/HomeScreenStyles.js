import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
    safeContainer: {
      flex: 1,
      backgroundColor: '#f5f5f5',
    },
    container: {
      flex: 1,
      alignItems: 'center',
      padding: 20,
      paddingTop: 40, // Ajuste esse valor conforme necessário
    },
    
    logo: {
      width: 60,
      height: 60,
      borderRadius: 50,
      resizeMode: 'cover',
      marginBottom: 10,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#33333',
      marginBottom: 10,
    },
    inputContainer: {
      width: '100%',
      marginBottom: 20,
    },
    input: {
      width: '100%',
      height: 50,
      backgroundColor: '#ffffff',
      borderRadius: 10,
      paddingHorizontal: 15,
      fontSize: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
      borderColor: '#ccc',
      borderWidth: 1,
    },
    listContainer: {
      flexGrow: 1,
      paddingBottom: 20,
    },
    auditoriaItem: {
      backgroundColor: '#ffffff',
      borderRadius: 8,
      padding: 15,
      marginBottom: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
      width: '100%',
    },
    auditoriaText: {
      fontSize: 16,
      marginBottom: 5,
      color: '#333',
    },
    label: {
      fontWeight: 'bold',
      color: '#555',
    },
    button: {
      width: '100%',
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
      marginTop: 10,
    },
    buttonAtivo: {
      backgroundColor: '#007BFF',
    },
    buttonInativo: {
      backgroundColor: '#ccc',
    },
    buttonText: {
      color: '#fff',
      fontSize: 14,
      fontWeight: 'bold',
    },
    errorText: {
      fontSize: 16,
      color: 'red',
      marginTop: 10,
      textAlign: 'center',
    },
    noResultsText: {
      fontSize: 16,
      color: '#999',
      marginTop: 20,
      textAlign: 'center',
    },
    refreshButton: {
      backgroundColor: '#007BFF',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 10,
      marginBottom: 20,
    },
    refreshButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });