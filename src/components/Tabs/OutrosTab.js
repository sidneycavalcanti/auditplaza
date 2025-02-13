import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal 
} from 'react-native';

import Calculadora from '../Calculadora';

import styles from '../../styles/AuditoriaScreenStyles';

const OutrosTab = ( {auditoriaId, setActiveTab} ) => {

  const [modalVisible, setModalVisible] = useState(false);

return( 

    <View style={styles.contentContainer}>
    <TouchableOpacity style={styles.button} onPress={() => setActiveTab('Pausa')}>
      <Text style={styles.buttonText}>Pausa</Text>
    </TouchableOpacity>
   <TouchableOpacity style={styles.button} onPress={() => setActiveTab('Avalicao')}>
      <Text style={styles.buttonText}>Avaliação operacional</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
      <Text style={styles.buttonText}>Calculadora</Text>
    </TouchableOpacity>
     {/* Modal para abrir a calculadora */}
     <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalBackground}>
          <Calculadora onClose={() => setModalVisible(false)} />
        </View>
      </Modal>
  </View>)
   
};

  export default OutrosTab;