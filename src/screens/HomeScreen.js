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
} from 'react-native';
import { format, isToday, parseISO } from 'date-fns';

import useAuditorias from '../hooks/useAuditorias';

import styles from '../styles/HomeScreenStyles'



const HomeScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { auditorias, loading, error, fetchAuditorias } = useAuditorias();

  const handleAuditoria = (lojaId, lojaName, data, userName, userId, auditoriaId) => {
    if (!auditoriaId) {
      console.error('auditoriaId está indefinido antes da navegação');
      return;
    }
    if (!lojaId) {
      console.error('lojaId está indefinido antes da navegação');
      return;
    }
    if (!userId) {
      console.error('userId está indefinido antes da navegação');
      return;
    }
    navigation.navigate('Auditoria', {
      lojaId,
      lojaName,
      data: format(data, 'dd/MM/yyyy HH:mm:ss'), // Data e hora formatadas
      userName, // Nome do usuário
      userId,
      auditoriaId, // Inclua o ID da auditoria
    });
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  // Ordenar auditorias e converter datas
  const sortedAuditorias = auditorias
    ?.map((item) => ({
      ...item,
      data: parseISO(item.data),
    }))
    .sort((a, b) => b.data - a.data);

  // Filtrar auditorias pelo texto de busca
  const filteredAuditorias = sortedAuditorias?.filter((item) =>
    item.loja?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderAuditoria = ({ item }) => {
    const isDisponivel = isToday(item.data);

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
              item.loja?.id, // ID da loja
              item.loja?.name, // Nome da loja
              item.data, // Data da auditoria
              item.usuario?.name, // Nome do usuário
              item.usuario?.id, // ID da usuario
              item.id // ID da auditoria
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