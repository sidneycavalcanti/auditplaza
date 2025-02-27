import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import useAuth from '../hooks/useAuth';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos!');
      return;
    }

    try {
      const response = await login(email, password);

      if (response.success) {
        Alert.alert(`Bem-vindo, ${response.data.user.username}`);
        navigation.navigate('Home');
      } else {
        Alert.alert(response.error || 'Usuário ou senha incorretos. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro inesperado no login:', error);
      Alert.alert('Erro', 'Ocorreu um erro inesperado. Tente novamente mais tarde.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          enableOnAndroid={true}
          
        >
          {/* Logo */}
          <Image style={styles.logo} source={require('../assets/logo.png')} />

          {/* Título 
          {/*<Text style={styles.title}>Auditoria Plaza</Text>*/}

          {/* Mensagem de erro (se existir) */}
          {error && <Text style={styles.errorText}>{error}</Text>}

          {/* Campo de uisuario */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Usuário"
              placeholderTextColor="#888"
              keyboardType="Nome"
              value={email}
              onChangeText={setEmail}
            />
          </View>
          

          {/* Campo de Senha */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Senha"
              placeholderTextColor="#888"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {/* Botão de Login */}
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? 'Entrando...' : 'Entrar'}</Text>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  logo: {
    width: 200,
    height: 200,
    //borderRadius: 100,
    //resizeMode: 'cover',
    //elevation: 20,
    marginBottom: 20,
    marginTop: -50,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#20B2AA',
    marginBottom: 20,
  },
  inputContainer: {
    width: '80%',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  button: {
    width: '70%',
    height: 40,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: '#b2d8d8',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
  },
});

export default LoginScreen;
