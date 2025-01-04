import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

import styles from '../../styles/AuditoriaScreenStyles';

const OutrosTab = () => {

return( 

    <View style={styles.contentContainer}>
    <TouchableOpacity style={styles.button}>
      <Text style={styles.buttonText}>Pausa</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.button}>
      <Text style={styles.buttonText}>Operacional</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.button}>
      <Text style={styles.buttonText}>Calculadora</Text>
    </TouchableOpacity>
  </View>)
   
};

  export default OutrosTab;