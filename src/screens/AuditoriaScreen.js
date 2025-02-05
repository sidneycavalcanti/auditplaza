import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import useAuditoriaDetails from '../hooks/useAuditoriaDetails';

import styles from '../styles/AuditoriaScreenStyles'

import PerdasTab from '../components/Tabs/PerdasTab';
import VendasTab from '../components/Tabs/VendasTab';
import FluxoTab from '../components/Tabs/FluxoTab';
import AnotacoesTab from '../components/Tabs/AnotacoesTab';
import OutrosTab from '../components/Tabs/OutrosTab';

import VendasEditTab from '../components/Tabs/VendasEditTab';
import PerdasEditTab from '../components/Tabs/PerdasEditTab';


import UltimasVendasTab from '../components/Tabs/UltimaVendasTab';
import UltimasPerdasTab from '../components/Tabs/UltimaPerdasTab';
import UltimasAnostacoesTab from '../components/Tabs/UltimasAnostacoesTab.js';

const AuditoriaScreen = ({ route }) => {
  
  const [selectedVenda, setSelectedVenda] = useState(null); // 🔥 Armazena a venda selecionada
  const [selectedPerda, setSelectedPerda] = useState(null);
  const [activeTab, setActiveTab] = useState('Vendas');
  const navigation = useNavigation();
  const { lojaName, lojaId, data, userName, auditoriaId } = route.params || {
    lojaName: 'Loja Desconhecida',
    data: 'Data Indisponível',
    userName: 'Auditor Desconhecido',
    auditoriaId: null,
  };
  {/*
  useEffect(() => {
    console.log('auditoria id', auditoriaId)
    console.log('usuario id', userId)
    console.log('loja id', lojaId)
  }, []);

  */}


  const { auditoriadetails } = useAuditoriaDetails();

  // Verificar a autenticação do usuário
  const checkAuthentication = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      Alert.alert('Sessão expirada', 'Por favor, faça login novamente.');
      navigation.navigate('Login');
    }
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  useEffect(() => {
    console.log('AuditoriaScreen -> route.params:', route.params); // Verifique os dados passados
  }, [route.params]);

  const renderContent = () => {
    switch (activeTab) {
      case 'VendasEditTab':
        return (
          <VendasEditTab
            auditoriaId={auditoriaId}
            lojaName={lojaName}
            data={data}
            userName={userName}
            setActiveTab={setActiveTab} // 🔥 Mantém a função passando
            venda={selectedVenda} // 🔥 Passa a venda selecionada
          />
        );
      case 'PerdasEditTab':
        return (
          <PerdasEditTab
            auditoriaId={auditoriaId}
            lojaName={lojaName}
            data={data}
            userName={userName}
            setActiveTab={setActiveTab} // 🔥 Mantém a função passando
            perda={selectedPerda} // 🔥 Passa a venda selecionada
          />
        );
      case 'UltimasPerdas':
        return (
          <UltimasPerdasTab
            auditoriaId={auditoriaId}
            lojaName={lojaName}
            data={data}
            userName={userName}
            setActiveTab={(tab, perda = null) => {
              setSelectedPerda(perda); // 🔥 Guarda a perda para edição
              setActiveTab(tab);
            }}
          />
        );
        case 'UltimasVendas':
          return (
            <UltimasVendasTab
              auditoriaId={auditoriaId}
              setActiveTab={(tab, venda = null) => {
                setSelectedVenda(venda);
                setActiveTab(tab);
              }} // 🔥 Agora passa a venda corretamente
            />
          );
      case 'Vendas':
        return (
          <VendasTab
            auditoriaId={auditoriaId}
            userName={userName}
            lojaId={lojaId}
            lojaName={lojaName}
            data={data}
            setActiveTab={setActiveTab} // 🔥 Mantém a função passando
          />
        );
      case 'Fluxo':
        return (
          <FluxoTab
            auditoriaId={auditoriaId}
            userName={userName}
            lojaName={lojaName}
            data={data}
          />
        );
      case 'Perdas':
        return (
          <PerdasTab
          auditoriaId={auditoriaId}
          userName={userName}
          lojaId={lojaId}
          lojaName={lojaName}
          data={data}
          setActiveTab={setActiveTab} 
        />
        );
      case 'Anotações':
        return (
          <AnotacoesTab
            auditoriaId={auditoriaId}
            userName={userName}
            lojaName={lojaName}
            data={data}
          />
        );
      case 'Outros':
        return (
          <OutrosTab
            auditoriaId={auditoriaId}
            userName={userName}
            lojaName={lojaName}
            data={data}
          />
        );
      default:
        return (
          <VendasTab
            auditoriaId={auditoriaId}
            userName={userName}
            lojaName={lojaName}
            data={data}
            setActiveTab={setActiveTab}
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      {/* Barra com o nome da loja, data/hora e nome do usuário */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Loja: {lojaName}</Text>
        <Text style={styles.headerText}>Data: {data}</Text>
        <Text style={styles.headerText}>Auditor: {userName}</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {['Vendas', 'Perdas', 'Fluxo', 'Anotações', 'Outros'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabButton, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Conteúdo da aba */}
      <ScrollView style={styles.scrollContainer}>{renderContent()}</ScrollView>
    </View>

  );
};



export default AuditoriaScreen;
