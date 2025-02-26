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
import Icon from 'react-native-vector-icons/Ionicons';
import { format, isToday, parseISO } from 'date-fns';

import useAuditorias from '../hooks/useAuditorias';
import styles from '../styles/HomeScreenStyles';

const HomeScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { auditorias, loading, error, fetchAuditorias } = useAuditorias();

  const handleAuditoria = (
    lojaId,
    lojaName,
    data,
    userName,
    usuarioId,
    auditoriaId
  ) => {
    navigation.navigate('Auditoria', {
      lojaId,
      lojaName,
      data: format(data, 'dd/MM/yyyy HH:mm:ss'),
      userName,
      usuarioId,
      auditoriaId,
    });
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  const sortedAuditorias = auditorias
    ?.map((item) => ({
      ...item,
      data: parseISO(item.data),
    }))
    .sort((a, b) => b.data - a.data);

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
          <Text style={styles.label}>Status:</Text>{' '}
          {isDisponivel ? 'Disponível' : 'Indisponível'}
        </Text>
        <TouchableOpacity
          style={[
            styles.button,
            isDisponivel ? styles.buttonAtivo : styles.buttonInativo,
          ]}
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
        {/* Header: Logo e botão de configuração */}
        <View style={styles.header}>
          <Image style={styles.logo} source={require('../assets/logo.png')} />
          <TouchableOpacity onPress={() => navigation.navigate('ProfileConfig')}>
            <Icon name="settings-outline" size={30} color="#000" />
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Minhas Auditorias</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Pesquisar auditorias por loja..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>

        <TouchableOpacity
          style={styles.refreshButton}
          onPress={fetchAuditorias}
          disabled={loading}
        >
          <Text style={styles.refreshButtonText}>
            {loading ? 'Atualizando...' : 'Atualizar'}
          </Text>
        </TouchableOpacity>

        {loading && <ActivityIndicator size="large" color="#20B2AA" />}

        {error && (
          <Text style={styles.errorText}>
            Erro ao buscar auditorias: {error}
          </Text>
        )}

        {!loading && !error && filteredAuditorias?.length > 0 ? (
          <FlatList
            data={filteredAuditorias}
            keyExtractor={(item) => item.id?.toString()}
            renderItem={renderAuditoria}
            contentContainerStyle={styles.listContainer}
            style={{ width: '100%' }}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          !loading &&
          !error && (
            <Text style={styles.noResultsText}>Nenhuma auditoria encontrada.</Text>
          )
        )}
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
