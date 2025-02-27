import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';

const ProfileScreen = () => {
  const route = useRoute();
  const { userId } = route.params; // Recebe o id do usuário via parâmetros de rota

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    // Aqui você pode buscar os dados do usuário através do userId (por exemplo, via API)
    // Exemplo: fetchUserData(userId).then(data => { setName(data.name); setPassword(data.password); });
    // Para este exemplo, vamos usar valores fixos
    setName('Nome do Usuário');
    setPassword('senha123');
  }, [userId]);

  const handleSave = () => {
    // Aqui você pode implementar a lógica para salvar as alterações, por exemplo, enviando os dados para uma API
    Alert.alert('Perfil Atualizado', `Nome: ${name}\nSenha: ${password}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Perfil</Text>
      <Text style={styles.label}>Nome:</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Digite seu nome"
      />
      <Text style={styles.label}>Senha:</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Digite sua senha"
        secureTextEntry
      />
      <Button title="Salvar" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 18, marginTop: 10 },
  input: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 5, 
    padding: 10, 
    marginTop: 5 
  }
});

export default ProfileScreen;
