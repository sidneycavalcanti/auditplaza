import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';

const PausaModal = ({ visible, pausaAtiva, onClose }) => {
  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={() => {}}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>⏳ Pausa em andamento</Text>
          <Text style={styles.modalText}>
            Motivo: {pausaAtiva?.motivodepausa?.name || 'Não informado'}
          </Text>

          <TouchableOpacity style={styles.encerrarPausaButton} onPress={onClose}>
            <Text style={styles.buttonText}>Encerrar Pausa</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  encerrarPausaButton: {
    backgroundColor: '#FF6347',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PausaModal;
