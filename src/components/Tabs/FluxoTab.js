import React, { useState } from 'react';

import {
    View,
    Text,
    TouchableOpacity,
  } from 'react-native';

import styles from '../../styles/AuditoriaScreenStyles'

const FluxoTab = () => {
    const [fluxo, setFluxo] = useState({
      masculino: { especulador: 0, acompanhante: 0, outros: 0 },
      feminino: { especulador: 0, acompanhante: 0, outros: 0 },
    });

    const handleIncrement = (gender, type) => {
      setFluxo((prevState) => ({
        ...prevState,
        [gender]: {
          ...prevState[gender],
          [type]: prevState[gender][type] + 1,
        },
      }));
    };

    const handleDecrement = (gender, type) => {
      setFluxo((prevState) => ({
        ...prevState,
        [gender]: {
          ...prevState[gender],
          [type]: Math.max(0, prevState[gender][type] - 1), // Não permite valores negativos
        },
      }));
    };
    
    const capitalizeFirstLetter = (string) => {
        if (!string) return ''; // Verifica se a string é válida
        return string.charAt(0).toUpperCase() + string.slice(1);
      };

    return (
      <View style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>Fluxo de Pessoas</Text>

        {/* Cabeçalhos */}
        <View style={styles.headerRow}>
          <Text style={styles.headerText}>Masculino</Text>
          <Text style={styles.headerText}>Feminino</Text>
        </View>

        {/* Categorias */}
        {['especulador', 'acompanhante', 'outros'].map((category) => (
          <View key={category} style={styles.row}>
            {/* Masculino */}
            <View style={styles.counterGroup}>
              <Text style={styles.label}>{capitalizeFirstLetter(category)}</Text>
              <View style={styles.counterContainer}>
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => handleDecrement('masculino', category)}
                >
                  <Text style={styles.counterButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.counterValue}>{fluxo.masculino[category]}</Text>
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => handleIncrement('masculino', category)}
                >
                  <Text style={styles.counterButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Feminino */}
            <View style={styles.counterGroup}>
              <Text style={styles.label}>{capitalizeFirstLetter(category)}</Text>
              <View style={styles.counterContainer}>
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => handleDecrement('feminino', category)}
                >
                  <Text style={styles.counterButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.counterValue}>{fluxo.feminino[category]}</Text>
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => handleIncrement('feminino', category)}
                >
                  <Text style={styles.counterButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Salvar Fluxo</Text>
        </TouchableOpacity>
      </View>
    );
  };


  export default FluxoTab;
