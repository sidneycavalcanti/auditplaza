import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';

const Calculadora = ({ onClose }) => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  const handlePress = (value) => {
    setInput((prev) => prev + value);
  };

  const handleBackspace = () => {
    setInput((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setInput('');
    setResult('');
  };

  const handleCalculate = () => {
    try {
      const sanitizedInput = input.replace(/[^-()\d/*+.]/g, '');
      setResult(eval(sanitizedInput).toString()); // Calcula a expressão
    } catch (error) {
      setResult('Erro');
    }
  };

  return (
    <View style={styles.modalBackground}>
      <View style={styles.modalContainer}>
        <Text style={styles.title}>🧮 Calculadora</Text>
        <TextInput style={styles.input} value={input} editable={false} />
        <Text style={styles.resultText}>{result}</Text>

        {/* 🔢 Linha 1 */}
        <View style={styles.row}>
          {['7', '8', '9', '/'].map((char) => (
            <TouchableOpacity key={char} style={styles.button} onPress={() => handlePress(char)}>
              <Text style={styles.buttonText}>{char}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 🔢 Linha 2 */}
        <View style={styles.row}>
          {['4', '5', '6', '*'].map((char) => (
            <TouchableOpacity key={char} style={styles.button} onPress={() => handlePress(char)}>
              <Text style={styles.buttonText}>{char}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 🔢 Linha 3 */}
        <View style={styles.row}>
          {['1', '2', '3', '-'].map((char) => (
            <TouchableOpacity key={char} style={styles.button} onPress={() => handlePress(char)}>
              <Text style={styles.buttonText}>{char}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 🔢 Linha 4 */}
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

        {/* 🔢 Linha 5 (C, ⌫, Enter, Fechar) */}
        <View style={styles.row}>
          <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
            <Text style={styles.buttonText}>C</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.backButton} onPress={handleBackspace}>
            <Text style={styles.buttonText}>⌫</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.enterButton} onPress={handleCalculate}>
            <Text style={styles.buttonText}>Enter</Text>
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
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 10,
    alignItems: 'center',
    width: '90%',
    elevation: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '90%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    textAlign: 'right',
    fontSize: 24,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  resultText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#20B2AA',
    padding: 15,
    borderRadius: 5,
    margin: 5,
    width: 65,
    alignItems: 'center',
  },
  clearButton: {
    backgroundColor: '#ff4444',
    padding: 15,
    borderRadius: 5,
    margin: 5,
    width: 65,
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: '#FFA500',
    padding: 15,
    borderRadius: 5,
    margin: 5,
    width: 65,
    alignItems: 'center',
  },
  enterButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    margin: 5,
    width: 65,
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: '#444',
    padding: 15,
    borderRadius: 5,
    margin: 5,
    width: 65,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Calculadora;
