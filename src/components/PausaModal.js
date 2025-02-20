import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';

const PausaModal = ({ visible, pausaAtiva, onClose }) => {
  return (
    <Modal 
      animationType="slide" 
      transparent={true} 
      visible={visible} 
      onRequestClose={onClose} // 🔥 Permite fechar no Android pressionando "Voltar"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>⏳ Pausa em andamento</Text>

          <Text style={styles.modalText}>
            Motivo: {pausaAtiva?.motivodepausa?.name || 'Não informado'}
          </Text>

          {/* 🔥 Botão para encerrar pausa */}
          <TouchableOpacity style={styles.encerrarPausaButton} onPress={onClose}>
            <Text style={styles.buttonText}>Encerrar Pausa</Text>
          </TouchableOpacity>

          {/* 🔥 Opcional: Botão para cancelar sem encerrar */}
          <TouchableOpacity style={styles.cancelButton} onPress={() => {}}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
};

// 🔥 Estilos melhorados para um design mais responsivo
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // 🔥 Fundo escuro para foco no modal
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '85%', // 🔥 Melhor responsividade
    maxWidth: 400, // 🔥 Evita que fique muito grande em telas maiores
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#555',
  },
  encerrarPausaButton: {
    backgroundColor: '#FF6347',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10, // 🔥 Espaço para o botão de "Cancelar"
  },
  cancelButton: {
    backgroundColor: '#ccc',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PausaModal;
