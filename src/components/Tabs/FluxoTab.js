import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import useAuditoriaDetails from '../../hooks/useAuditoriaDetails';
import styles from '../../styles/AuditoriaScreenStyles';

const FluxoTab = ({ auditoriaId }) => {
  const { fetchFluxo, atualizarFluxo } = useAuditoriaDetails();
  const [fluxo, setFluxo] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarFluxo = async () => {
      try {
        console.log("🔄 Buscando fluxo para auditoria:", auditoriaId);
        const fluxoData = await fetchFluxo(auditoriaId);

        console.log("✅ Dados recebidos do fluxo:", fluxoData);

        if (fluxoData && fluxoData.fluxopessoa) {
          // 🔥 Transformar array em objeto baseado na categoria e sexo
          const fluxoFormatado = fluxoData.fluxopessoa.reduce((acc, item) => {
            const key = `${item.categoria}_${item.sexo}`; // Ex: "outros_masculino"
            acc[key] = item.quantidade || 0; // Pega corretamente a quantidade
            return acc;
          }, {});

          setFluxo(fluxoFormatado);
        } else {
          console.warn("⚠️ Nenhum fluxo encontrado.");
        }
      } catch (error) {
        console.error("❌ Erro ao carregar fluxo:", error);
      } finally {
        setLoading(false);
      }
    };

    if (auditoriaId) {
      carregarFluxo();
    }
  }, [auditoriaId]);

  const handleUpdateFluxo = async (categoria, sexo, valor) => {
    const key = `${categoria}_${sexo}`;
    const novoValor = Math.max((fluxo[key] || 0) + valor, 0);

    setFluxo((prev) => ({
      ...prev,
      [key]: novoValor,
    }));

    try {
      await atualizarFluxo(auditoriaId, categoria, sexo, novoValor);
    } catch (error) {
      console.error('Erro ao atualizar fluxo:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#20B2AA" />
        <Text>Carregando fluxo...</Text>
      </View>
    );
  }

  return (
    <View style={styles.contentContainer}>
      {fluxo ? (
        <>
          {/* 🔥 Masculino */}
          <Text style={styles.sectionTitle}>🧑 Masculino</Text>
          {['especulador', 'acompanhante', 'outros'].map((categoria) => (
            <View key={`${categoria}_masculino`} style={styles.fluxoItem}>
              <Text style={styles.label}>{categoria.charAt(0).toUpperCase() + categoria.slice(1)}:</Text>
              
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.buttonMinus}
                  onPress={() => handleUpdateFluxo(categoria, 'masculino', -1)}
                >
                  <Text style={styles.buttonText}>-</Text>
                </TouchableOpacity>
                
                <Text style={styles.valorText}>{fluxo[`${categoria}_masculino`] || 0}</Text>
                
                <TouchableOpacity
                  style={styles.buttonPlus}
                  onPress={() => handleUpdateFluxo(categoria, 'masculino', 1)}
                >
                  <Text style={styles.buttonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {/* 🔥 Feminino */}
          <Text style={styles.sectionTitle}>👩 Feminino</Text>
          {['especulador', 'acompanhante', 'outros'].map((categoria) => (
            <View key={`${categoria}_feminino`} style={styles.fluxoItem}>
              <Text style={styles.label}>{categoria.charAt(0).toUpperCase() + categoria.slice(1).replace('_', ' ')}:</Text>
              
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.buttonMinus}
                  onPress={() => handleUpdateFluxo(categoria, 'feminino', -1)}
                >
                  <Text style={styles.buttonText}>-</Text>
                </TouchableOpacity>
                
                <Text style={styles.valorText}>{fluxo[`${categoria}_feminino`] || 0}</Text>
                
                <TouchableOpacity
                  style={styles.buttonPlus}
                  onPress={() => handleUpdateFluxo(categoria, 'feminino', 1)}
                >
                  <Text style={styles.buttonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </>
      ) : (
        <Text style={styles.errorText}>Nenhum dado encontrado</Text>
      )}
    </View>
  );
};

export default FluxoTab;
