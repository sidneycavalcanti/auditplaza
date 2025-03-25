import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import styles from '../../styles/AuditoriaScreenStyles';
import useAuditoriaDetails from '../../hooks/useAuditoriaDetails';

// 🔥 Hook personalizado para controle da pausa
import usePausa from '../../hooks/usePausa';
// 🔥 Componente de modal externo
import PausaModal from '../PausaModal';

const PausasTab = ({ auditoriaId, setActiveTab }) => {
  const { fetchMotivoPausa, motivopausa, loading, error } = useAuditoriaDetails();

  // Hook de controle de pausa
  const { handleCadastrarPausa, handleEncerrarPausa, pausaAtiva, modalVisible, setModalVisible } = usePausa(auditoriaId);
  const [selectedMotivoPausa, setSelectedMotivoPausa] = useState('');

  // Busca os motivos de pausa ao montar o componente
  useEffect(() => {
    fetchMotivoPausa();
  }, []);

  useEffect(() => {
    console.log("🔄 selectedMotivoPausa atualizado:", selectedMotivoPausa);
  }, [selectedMotivoPausa]);
  

  // Criar uma nova pausa e bloquear a interface
  const handleNovaPausa = async () => {
   // console.log("🟡 Motivo de pausa selecionado antes de cadastrar:", selectedMotivoPausa);
  
    if (!selectedMotivoPausa) {
      Alert.alert('Por favor, Selecione um motivo para a pausa.');
      return;
    }
  
    const result = await handleCadastrarPausa(selectedMotivoPausa);
  
    if (result.error) {
      Alert.alert('Erro', result.error);
    } else {
      console.log("✅ Pausa cadastrada com sucesso!", result);
      setSelectedMotivoPausa(''); // 🔥 Limpa o campo após o cadastro
    }
  };
  
  

  // Renderiza um indicador de carregamento enquanto os dados estão sendo buscados
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large"  color="#778899"  />
        <Text>Carregando informações...</Text>
      </View>
    );
  }

  // Renderiza o conteúdo principal
  return (
    <View style={styles.contentContainer}>
      <Text style={styles.sectionTitle}>Motivo da Pausa:</Text>
      <Picker
  selectedValue={selectedMotivoPausa}
  onValueChange={(itemValue) => {
    console.log("📌 Novo motivo de pausa selecionado:", itemValue); // 🔍 Verifica se o valor está sendo atualizado corretamente
    setSelectedMotivoPausa(String(itemValue));
  }}
  style={styles.picker}
>
  <Picker.Item label="Selecione um motivo" value="" />
  {motivopausa.map((motivo) => (
    <Picker.Item key={motivo.id} label={motivo.name} value={String(motivo.id)} />
  ))}
</Picker>



      <TouchableOpacity style={styles.button} onPress={handleNovaPausa}>
        <Text style={styles.buttonText}>Adicionar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => setActiveTab('UltimasPausas')}>
        <Text style={styles.buttonText}>Últimas Pausas</Text>
      </TouchableOpacity>

      {/* 🔥 Modal de Pausa Externo para bloquear a interface */}
      <PausaModal visible={modalVisible} pausaAtiva={pausaAtiva} onClose={handleEncerrarPausa} />
    </View>
  );
};

export default PausasTab;
