import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

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
    <View style={styles.container}>
      <View style={styles.modalContainer}>
        <Text style={styles.title}>Calculadora</Text>
        <TextInput style={styles.input} value={input} editable={false} />
        <Text style={styles.resultText}>{result}</Text>

        {[
          ['7', '8', '9', '/'],
          ['4', '5', '6', '*'],
          ['1', '2', '3', '-'],
          ['0', '.', '=', '+'],
        ].map((row, i) => (
          <View key={i} style={styles.row}>
            {row.map((char) => (
              <TouchableOpacity
                key={char}
                style={styles.button}
                onPress={char === '=' ? handleCalculate : () => handlePress(char)}
              >
                <Text style={styles.buttonText}>{char}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}

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
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingBottom: 30,
  },
  modalContainer: {
    width: width * 0.9,
    backgroundColor: '#fff',
    padding: width * 0.05,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: height * 0.06,
    borderWidth: 1,
    borderColor: '#ccc',
    textAlign: 'right',
    fontSize: width * 0.06,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  resultText: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.06,
    borderRadius: 5,
    margin: 3,
    alignItems: 'center',
  },
  clearButton: {
    backgroundColor: '#ff4444',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.08,
    borderRadius: 5,
    margin: 3,
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: '#444',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.08,
    borderRadius: 5,
    margin: 3,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: width * 0.045,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Calculadora;
