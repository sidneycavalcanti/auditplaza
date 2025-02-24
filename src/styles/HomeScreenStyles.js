import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    safeContainer: {
      flex: 1,
      backgroundColor: '#f5f5f5',
    },
    container: {
      flex: 1,
      alignItems: 'center',
      padding: 20,
    },
    logo: {
      width: 100,
      height: 100,
      borderRadius: 50,
      resizeMode: 'cover',
      marginBottom: 10,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#20B2AA',
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
      borderRadius: 25,
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
      borderRadius: 25,
      marginTop: 10,
    },
    buttonAtivo: {
      backgroundColor: '#20B2AA',
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
      backgroundColor: '#20B2AA',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 25,
      marginBottom: 20,
    },
    refreshButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });