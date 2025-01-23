import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  SafeAreaView,
  Alert,
} from 'react-native';
import { format, isToday, parseISO } from 'date-fns';

import useAuditorias from '../hooks/useAuditorias';
import styles from '../styles/HomeScreenStyles';

const HomeScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { auditorias, loading, error, fetchAuditorias } = useAuditorias();

  const handleAuditoria = (lojaId, lojaName, data, userName, userId, auditoriaId) => {
    console.log('Iniciando auditoria com os parâmetros:', {
      lojaId,
      lojaName,
      data,
      userName,
      userId,
      auditoriaId,
    });
  
    if (!auditoriaId || !lojaId || !userId) {
      console.error('Erro: Parâmetros faltando antes da navegação');
      return Alert.alert('Erro', 'Dados incompletos para iniciar auditoria.');
    }
  
    navigation.navigate('Auditoria', {
      lojaId, // Incluindo o ID da loja na navegação
      lojaName,
      data: format(data, 'dd/MM/yyyy HH:mm:ss'),
      userName,
      userId,
      auditoriaId,
    });
  };
  

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  // Ordenar auditorias e converter datas
  const sortedAuditorias = auditorias
    ?.map((item) => ({
      ...item,
      data: parseISO(item.data), // Converte a data para um formato manipulável
    }))
    .sort((a, b) => b.data - a.data); // Ordena da mais recente para a mais antiga

  // Filtrar auditorias pelo texto de busca
  const filteredAuditorias = sortedAuditorias?.filter((item) =>
    item.loja?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderAuditoria = ({ item }) => {
    const isDisponivel = isToday(item.data);
  
    console.log('Renderizando auditoria:', {
      lojaId: item.loja?.id,
      lojaName: item.loja?.name,
      data: item.data,
      userName: item.usuario?.name,
      userId: item.usuario?.id,
      auditoriaId: item.id,
    });
  
    return (
      <View style={styles.auditoriaItem}>
        <Text style={styles.auditoriaText}>
          <Text style={styles.label}>Loja:</Text> {item.loja?.name || 'N/A'}
        </Text>
        <Text style={styles.auditoriaText}>
          <Text style={styles.label}>Data:</Text> {format(item.data, 'dd/MM/yyyy')}
        </Text>
        <Text style={styles.auditoriaText}>
          <Text style={styles.label}>Status:</Text> {isDisponivel ? 'Disponível' : 'Indisponível'}
        </Text>
        <TouchableOpacity
          style={[styles.button, isDisponivel ? styles.buttonAtivo : styles.buttonInativo]}
          disabled={!isDisponivel}
          onPress={() =>
            handleAuditoria(
              item.loja?.id || null,
              item.loja?.name || 'N/A',
              item.data || null,
              item.usuario?.name || 'N/A',
              item.usuario?.id || null,
              item.id || null
            )
          }
        >
          <Text style={styles.buttonText}>
            {isDisponivel ? 'Iniciar Auditoria' : 'Indisponível'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        {/* Logo e título */}
        <Image style={styles.logo} source={require('../assets/logo.png')} />
        <Text style={styles.title}>Minhas Auditorias</Text>

        {/* Campo de busca */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Pesquisar auditorias por loja..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>

        {/* Botão de atualizar */}
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={fetchAuditorias}
          disabled={loading}
        >
          <Text style={styles.refreshButtonText}>
            {loading ? 'Atualizando...' : 'Atualizar'}
          </Text>
        </TouchableOpacity>

        {/* Indicador de carregamento */}
        {loading && <ActivityIndicator size="large" color="#20B2AA" />}

        {/* Mensagem de erro */}
        {error && <Text style={styles.errorText}>Erro ao buscar auditorias: {error}</Text>}

        {/* Lista de auditorias */}
        {!loading && !error && filteredAuditorias?.length > 0 ? (
          <FlatList
            data={filteredAuditorias}
            keyExtractor={(item) => item.id?.toString()}
            renderItem={renderAuditoria}
            contentContainerStyle={styles.listContainer}
            style={{ width: '100%' }} // Preenche toda a largura
            showsVerticalScrollIndicator={false}
          />
        ) : (
          !loading && !error && (
            <Text style={styles.noResultsText}>Nenhuma auditoria encontrada.</Text>
          )
        )}
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
