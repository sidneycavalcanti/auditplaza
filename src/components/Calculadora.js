import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
//import styles from '../../styles/AuditoriaScreenStyles';

const Calculadora = ({ onClose }) => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  const handlePress = (value) => {
    setInput((prev) => prev + value);
  };

  const handleClear = () => {
    setInput('');
    setResult('');
  };

  const handleCalculate = () => {
    try {
      setResult(eval(input).toString()); // ⚠️ Cuidado ao usar eval
    } catch (error) {
      setResult('Erro');
    }
  };

  return (

    <View style={styles.Container}>
    <View style={styles.modalContainer}>
      <Text style={styles.title}>Calculadora</Text>
      <TextInput style={styles.input} value={input} editable={false} />
      <Text style={styles.resultText}>{result}</Text>

      <View style={styles.row}>
        {['7', '8', '9', '/'].map((char) => (
          <TouchableOpacity key={char} style={styles.button} onPress={() => handlePress(char)}>
            <Text style={styles.buttonText}>{char}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.row}>
        {['4', '5', '6', '*'].map((char) => (
          <TouchableOpacity key={char} style={styles.button} onPress={() => handlePress(char)}>
            <Text style={styles.buttonText}>{char}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.row}>
        {['1', '2', '3', '-'].map((char) => (
          <TouchableOpacity key={char} style={styles.button} onPress={() => handlePress(char)}>
            <Text style={styles.buttonText}>{char}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.row}>
        {['0', '.', '=', '+'].map((char) => (
          <TouchableOpacity
            key={char}
            style={styles.button}
            onPress={char === '=' ? handleCalculate : () => handlePress(char)}
          >
            <Text style={styles.buttonText}>{char}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.row}>
        <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
          <Text style={styles.buttonText}>C</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.buttonText}>Fechar</Text>
        </TouchableOpacity>
      </View>
    </View>
    </View>
  );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end', // 🔥 Empurra para baixo
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingBottom: 50, // 🔥 Ajuste para controle fino
      },
    modalContainer: {
        backgroundColor: '#fff',
        padding: 30,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 35,
        elevation: 10,
      },
      input: {
        width: '80%',
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        textAlign: 'right',
        fontSize: 24,
        marginBottom: 10,
      },
      resultText: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
      },
      row: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
      },
      button: {
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 5,
        margin: 5,
        width: 60,
        alignItems: 'center',
      },
      clearButton: {
        backgroundColor: '#ff4444',
        padding: 15,
        borderRadius: 5,
        margin: 5,
        width: 80,
        alignItems: 'center',
      },
      closeButton: {
        backgroundColor: '#444',
        padding: 15,
        borderRadius: 5,
        margin: 5,
        width: 80,
        alignItems: 'center',
      },
      buttonText: {
        fontSize: 12,
        color: '#fff',
        fontWeight: 'bold',
      },
      modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
      },
})

export default Calculadora;
