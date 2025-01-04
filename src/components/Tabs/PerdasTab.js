import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import styles from '../../styles/AuditoriaScreenStyles';


const PerdasTab = () => {
  // Declaração de hooks dentro do componente funcional
  const [selectedReason, setSelectedReason] = useState('');
  const [observation, setObservation] = useState('');
  const [losses, setLosses] = useState([]);

  const addLoss = () => {
    if (!selectedReason || !observation) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }
    setLosses([...losses, { reason: selectedReason, observation }]);
    setSelectedReason('');
    setObservation('');
  };

    return(
      <View style={styles.contentContainer}>
      <Text style={styles.sectionTitle}>Motivo da Perda</Text>
      <Picker
        selectedValue={selectedReason}
        onValueChange={(itemValue) => setSelectedReason(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Selecione um motivo" value="" />
        <Picker.Item label="Quebra" value="Quebra" />
        <Picker.Item label="Desperdício" value="Desperdício" />
        <Picker.Item label="Outro" value="Outro" />
      </Picker>

      <Text style={styles.sectionTitle}>Observação</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Digite suas observações"
        placeholderTextColor="#888"
        multiline
        numberOfLines={4}
      // value={observation}
       // onChangeText={setObservation}
      />
      <TouchableOpacity style={styles.button} onPress={addLoss}>
        <Text style={styles.buttonText}>Gravar</Text>
      </TouchableOpacity>
    </View>
    );
  };

  export default PerdasTab;