import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import useAuditoriaDetails from '../../hooks/useAuditoriaDetails';
import styles from '../../styles/AuditoriaScreenStyles';

const FluxoTab = ({ auditoriaId }) => {
  const { fetchFluxo, atualizarFluxo } = useAuditoriaDetails();
  const [fluxo, setFluxo] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔄 Buscar os dados do fluxo ao entrar na tela
  useEffect(() => {
    const carregarFluxo = async () => {
      try {
        console.log(`🔄 Buscando fluxo para auditoria ID: ${auditoriaId}`);
        const fluxoData = await fetchFluxo(auditoriaId);
        if (fluxoData) {
          setFluxo(fluxoData);
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

  // ➕➖ Atualiza os valores no banco em tempo real codigo massa.
  const handleUpdateFluxo = async (fluxoId, valorAtual, incremento) => {
    if (!fluxo || fluxo.length === 0) return;

    const novoValor = Math.max(valorAtual + incremento, 0);

    // 🔥 Atualiza a UI imediatamente
    setFluxo((prev) =>
        prev.map((item) =>
            item.id === fluxoId ? { ...item, quantidade: novoValor } : item
        )
    );

    try {
        const requestBody = { quantidade: novoValor };
        await atualizarFluxo(fluxoId, requestBody);
        console.log(`✅ Atualização bem-sucedida: Fluxo ID ${fluxoId} agora tem ${novoValor}`);

        // 🔄 Faz um polling rápido depois de 1 segundo para garantir que está certo
        setTimeout(async () => {
            await carregarFluxo();
            console.log("🔄 Dados atualizados do servidor!");
        }, 1000);
    } catch (error) {
        console.error('❌ Erro ao atualizar fluxo:', error.response?.data || error.message);

        // Se falhar, reverte a UI para o valor anterior
        setFluxo((prev) =>
            prev.map((item) =>
                item.id === fluxoId ? { ...item, quantidade: valorAtual } : item
            )
        );
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
          {/* 🔥 Layout dividido em colunas */}
          <View style={styles.row}>
            {/* Masculino - Coluna esquerda */}
            <View style={styles.column}>
              <Text style={styles.headerText}>🧑 Masculino</Text>
              {Object.values(fluxo)
                .filter((item) => item.sexo === "masculino")
                .map((item) => (
                  <View key={item.id} style={styles.counterGroup}>
                    <Text style={styles.label}>
                      {item.categoria.charAt(0).toUpperCase() +
                        item.categoria.slice(1)}
                    </Text>
                    <View style={styles.counterContainer}>
                      <TouchableOpacity
                        style={styles.counterButton}
                        onPress={() =>
                          handleUpdateFluxo(item.id, item.quantidade, -1)
                        }
                      >
                        <Text style={styles.counterButtonText}>-</Text>
                      </TouchableOpacity>
                      <Text style={styles.valorText}>{item.quantidade}</Text>
                      <TouchableOpacity
                        style={styles.counterButton}
                        onPress={() =>
                          handleUpdateFluxo(item.id, item.quantidade, 1)
                        }
                      >
                        <Text style={styles.counterButtonText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
            </View>

            {/* Feminino - Coluna direita */}
            <View style={styles.column}>
              <Text style={styles.headerText}>👩 Feminino</Text>
              {Object.values(fluxo)
                .filter((item) => item.sexo === "feminino")
                .map((item) => (
                  <View key={item.id} style={styles.counterGroup}>
                    <Text style={styles.label}>
                      {item.categoria.charAt(0).toUpperCase() +
                        item.categoria.slice(1)}
                    </Text>
                    <View style={styles.counterContainer}>
                      <TouchableOpacity
                        style={styles.counterButton}
                        onPress={() =>
                          handleUpdateFluxo(item.id, item.quantidade, -1)
                        }
                      >
                        <Text style={styles.counterButtonText}>-</Text>
                      </TouchableOpacity>
                      <Text style={styles.valorText}>{item.quantidade}</Text>
                      <TouchableOpacity
                        style={styles.counterButton}
                        onPress={() =>
                          handleUpdateFluxo(item.id, item.quantidade, 1)
                        }
                      >
                        <Text style={styles.counterButtonText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
            </View>
          </View>
        </>
      ) : (
        <Text style={styles.errorText}>Nenhum dado encontrado</Text>
      )}
    </View>
  );
};


export default FluxoTab;
