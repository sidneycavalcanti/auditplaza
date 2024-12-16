import { StyleSheet } from 'react-native';

const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5', // Cor de fundo do app
    paddingHorizontal: 20, // Espaçamento lateral
  },
  logo: {
    width: 100, // Largura do logo
    height: 100, // Altura do logo
    marginBottom: 20, // Espaçamento abaixo do logo
    borderRadius: 50, // Torna o logo arredondado (metade da largura ou altura)
  },
  title: {
    fontSize: 24, // Tamanho da fonte
    fontWeight: 'bold', // Negrito
    color: '#333', // Cor do texto
    marginBottom: 10, // Espaçamento abaixo do título
    textAlign: 'center', // Centralização
  },
  subtitle: {
    fontSize: 16, // Tamanho da fonte
    color: '#666', // Cor do texto
    marginBottom: 20, // Espaçamento abaixo do subtítulo
    textAlign: 'center', // Centralização
  },
  input: {
    width: '100%', // Largura total do input
    height: 50, // Altura do input
    borderColor: '#ccc', // Cor da borda
    borderWidth: 1, // Largura da borda
    borderRadius: 8, // Bordas arredondadas
    marginBottom: 15, // Espaçamento entre os inputs
    paddingHorizontal: 15, // Espaçamento interno
    fontSize: 16, // Tamanho da fonte
    backgroundColor: '#fff', // Fundo branco
  },
  button: {
    width: '100%', // Largura total do botão
    height: 50, // Altura do botão
    justifyContent: 'center', // Centralização vertical
    alignItems: 'center', // Centralização horizontal
    backgroundColor: '#66CDAA', // Cor de fundo
    borderRadius: 8, // Bordas arredondadas
    marginTop: 10, // Espaçamento acima do botão
  },
  loadingIndicator: {
    marginVertical: 20, // Espaçamento acima e abaixo do indicador
  },
  errorText: {
    color: 'red', // Cor do texto de erro
    fontSize: 14, // Tamanho da fonte
    marginTop: 10, // Espaçamento acima do texto de erro
    textAlign: 'center', // Centralização
  },
  registerButton: {
    marginTop: 15, // Espaçamento acima do botão de registro
  },
  registerText: {
    color: '#66CDAA', // Cor do texto do botão de registro
    fontSize: 14, // Tamanho da fonte
    textAlign: 'center', // Centralização
    textDecorationLine: 'underline', // Texto sublinhado
  },
});

export default loginStyles;
