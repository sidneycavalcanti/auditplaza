import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
  } from 'react-native';

  import styles from '../../styles/AuditoriaScreenStyles';



const AnotacoesTab = () => {

    const [annotations, setAnnotations] = useState([]);
    const [annotation, setAnnotation] = useState('');

 const addAnnotation = () => {
    if (!annotation) {
      Alert.alert('Erro', 'Preencha o campo de anotações.');
      return;
    }
    setAnnotations([...annotations, annotation]);
    setAnnotation('');
  };

return(
<View style={styles.contentContainer}>
      <Text style={styles.sectionTitle}>Anotações</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Digite suas anotações"
        placeholderTextColor="#888"
        multiline
        numberOfLines={4}
        value={annotation}
        onChangeText={setAnnotation}
      />

      <TouchableOpacity style={styles.button} onPress={addAnnotation}>
        <Text style={styles.buttonText}>Gravar</Text>
      </TouchableOpacity>
      {/* 
      <FlatList
        data={annotations}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.listText}>{item}</Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <Text style={styles.listText}>Nenhuma anotação registrada.</Text>
        )}
      />
      */}
    </View>
);
};

export default AnotacoesTab;