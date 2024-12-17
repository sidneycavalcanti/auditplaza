import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView } from 'react-native';

const AuditoriaScreen = () => {
  const [activeTab, setActiveTab] = useState('Vendas'); // Define a aba ativa

  // Componentes das abas
  const VendasTab = () => (
    <View style={styles.contentContainer}>
      <Text style={styles.sectionTitle}>Valor</Text>
      <TextInput style={styles.input} placeholder="Digite o valor das vendas" />
      <Text style={styles.sectionTitle}>sexo</Text>
      <TextInput
          style={styles.input}
          placeholder="Masculino/Feminino"
          placeholderTextColor="#888"
          //value={sexo}
          //onChangeText={setSexo}
        />
         <Text style={styles.sectionTitle}>Forma de Pagamento:</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite a forma de pagamento"
          placeholderTextColor="#888"
         // value={formaPagamento}
          //onChangeText={setFormaPagamento}
        />
         <Text style={styles.sectionTitle}>Faixa Etária:</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 18-25, 26-35"
          placeholderTextColor="#888"
          //value={faixaEtaria}
          //onChangeText={setFaixaEtaria}
        />

         <Text style={styles.sectionTitle}>Observação:</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Digite suas observações"
          placeholderTextColor="#888"
         // value={observacao}
         // onChangeText={setObservacao}
          multiline
          numberOfLines={4}
        />

         {/* Checkboxes */}
         <View style={styles.checkboxContainer}>
          <TouchableOpacity style={styles.checkbox}>
            <Text style={styles.checkboxText}>Troca</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.checkbox}>
            <Text style={styles.checkboxText}>Virada</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button} onPress={"handleLogin"}>
                <Text style={styles.buttonText}>Adicionar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={"handleLogin"}>
                <Text style={styles.buttonText}>Ultimas vendas</Text>
        </TouchableOpacity>
   
    </View>
  );

  const FluxoTab = () => (
    <View style={styles.contentContainer}>
      <View style={styles.counterContainer}>
      <Text style={styles.sectionTitle}>Masculino</Text>
        <Counter label="Especulador" />
        <Counter label="Acompanhante" />
        <Counter label="Outros" />
      </View>

      <View style={styles.counterContainer}>
      <Text style={styles.sectionTitle}>Feminino</Text>
        <Counter label="Especulador" />
        <Counter label="Acompanhante" />
        <Counter label="Outros" />
      </View>
    </View>
  );

  const PerdasTab = () => (
    <View style={styles.contentContainer}>
      <Text style={styles.sectionTitle}>Perdas</Text>
      <TextInput style={styles.input} placeholder="Digite o valor das perdas" />
      <Text style={styles.sectionTitle}>Observação:</Text>
      <TextInput style={styles.textArea} multiline placeholder="Digite uma observação" />
      <TouchableOpacity style={styles.button} onPress={"handleLogin"}>
                <Text style={styles.buttonText}>Gravar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={"handleLogin"}>
                <Text style={styles.buttonText}>Últimas</Text>
        </TouchableOpacity>
    </View>
  );

  const AnotacoesTab = () => (
    <View style={styles.contentContainer}>
      <Text style={styles.sectionTitle}>Anotações</Text>
      <TextInput style={styles.textArea} multiline placeholder="Digite suas anotações" />
      <TouchableOpacity style={styles.button} onPress={"handleLogin"}>
                <Text style={styles.buttonText}>Gravar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={"handleLogin"}>
                <Text style={styles.buttonText}>Últimas</Text>
        </TouchableOpacity>
    </View>
    
  );

  const OutrosTab = () => (
    <View style={styles.contentContainer}>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Operacional</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Pausa</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Calculadora</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Trocar Auditor</Text>
      </TouchableOpacity>
    </View>
  );

  // Função de Contador
  const Counter = ({ label }) => {
    const [count, setCount] = useState(0);
    return (
      <View style={styles.counterRow}>
        <Text style={styles.counterLabel}>{label}</Text>
        <TouchableOpacity style={styles.counterButton} onPress={() => setCount(count - 1)}>
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.counterValue}>{count}</Text>
        <TouchableOpacity style={styles.counterButton} onPress={() => setCount(count + 1)}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Renderização das abas
  const renderContent = () => {
    switch (activeTab) {
      case 'Vendas':
        return <VendasTab />;
      case 'Fluxo':
        return <FluxoTab />;
      case 'Perdas':
        return <PerdasTab />;
      case 'Anotações':
        return <AnotacoesTab />;
      case 'Outros':
        return <OutrosTab />;
      default:
        return <VendasTab />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Menu de Abas */}
      <View style={styles.tabsContainer}>
        {['Vendas', 'Fluxo', 'Perdas', 'Anotações', 'Outros'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabButton, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={styles.tabText}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Conteúdo da Aba Selecionada */}
      <ScrollView>{renderContent()}</ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#ddd',
    paddingVertical: 10,
  },
  tabButton: { padding: 10 },
  activeTab: { borderBottomWidth: 3, borderBottomColor: '#20B2AA' },
  tabText: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  contentContainer: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  textArea: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    minHeight: 100,
    textAlignVertical: 'top',
    borderColor: '#ccc',
    borderWidth: 1,
  },
  counterContainer: { flexDirection: 'column', gap: 10 },
  counterRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  counterLabel: { flex: 1, fontSize: 16 },
  counterValue: { fontSize: 18, marginHorizontal: 10 },
  counterButton: {
    backgroundColor: '#20B2AA',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  button: {
    backgroundColor: '#20B2AA',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },

  checkboxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    elevation: 2,
  },
  checkboxText: {
    fontSize: 16,
    marginLeft: 5,
    color: '#333',
  },

  textArea: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    color: '#000',
    marginBottom: 15,
    elevation: 2,
    textAlignVertical: 'top',
  },
});

export default AuditoriaScreen;
