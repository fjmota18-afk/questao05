import { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  View,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

const SALDO_INICIAL = 1000;

function moeda(valor) {
  const [inteiro, decimal] = valor.toFixed(2).split('.');
  return `R$ ${inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${decimal}`;
}

export default function App() {
  const [saldo, setSaldo] = useState(SALDO_INICIAL);
  const [valor, setValor] = useState('');
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');

  // Retorna o valor em número, ou null se for inválido
  function lerValor() {
    const texto = valor.trim().replace(',', '.');
    if (texto === '') {
      setErro('Informe um valor.');
      setMensagem('');
      return null;
    }
    const numero = Number(texto);
    if (Number.isNaN(numero)) {
      setErro('Digite apenas números. Exemplo: 150 ou 150,50.');
      setMensagem('');
      return null;
    }
    if (numero <= 0) {
      setErro('O valor deve ser maior que zero.');
      setMensagem('');
      return null;
    }
    return Math.round(numero * 100) / 100;
  }

  function depositar() {
    const numero = lerValor();
    if (numero === null) return;
    setSaldo(Math.round((saldo + numero) * 100) / 100);
    setErro('');
    setMensagem(`Depósito de ${moeda(numero)} realizado.`);
    setValor('');
  }

  function sacar() {
    const numero = lerValor();
    if (numero === null) return;
    if (numero > saldo) {
      setErro(`Saldo insuficiente. Saldo disponível: ${moeda(saldo)}.`);
      setMensagem('');
      return;
    }
    setSaldo(Math.round((saldo - numero) * 100) / 100);
    setErro('');
    setMensagem(`Saque de ${moeda(numero)} realizado.`);
    setValor('');
  }

  function reiniciar() {
    setSaldo(SALDO_INICIAL);
    setValor('');
    setErro('');
    setMensagem('');
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style="light" />

      <Text style={styles.titulo}>Simulador de conta</Text>
      <Text style={styles.subtitulo}>Nenhum dinheiro real é movimentado.</Text>

      <View style={styles.cartao}>
        <Text style={styles.cartaoLabel}>Saldo atual</Text>
        <Text style={styles.cartaoSaldo}>{moeda(saldo)}</Text>
      </View>

      <Text style={styles.label}>Valor (R$)</Text>
      <TextInput
        style={[styles.input, erro ? styles.inputErro : null]}
        placeholder="Ex.: 200,00"
        placeholderTextColor="#7f8a96"
        keyboardType="decimal-pad"
        value={valor}
        onChangeText={setValor}
      />

      {erro !== '' && <Text style={styles.erro}>{erro}</Text>}
      {mensagem !== '' && <Text style={styles.sucesso}>{mensagem}</Text>}

      <View style={styles.botoes}>
        <Pressable
          style={({ pressed }) => [styles.botao, styles.botaoDepositar, pressed && styles.pressionado]}
          onPress={depositar}
        >
          <Text style={styles.botaoTexto}>Depositar</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.botao, styles.botaoSacar, pressed && styles.pressionado]}
          onPress={sacar}
        >
          <Text style={styles.botaoTexto}>Sacar</Text>
        </Pressable>
      </View>

      <Pressable
        style={({ pressed }) => [styles.botaoLink, pressed && styles.pressionado]}
        onPress={reiniciar}
      >
        <Text style={styles.botaoLinkTexto}>Reiniciar conta (R$ 1.000,00)</Text>
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#14202b',
    padding: 24,
    justifyContent: 'center',
  },
  titulo: { fontSize: 28, fontWeight: '700', color: '#ffffff' },
  subtitulo: { fontSize: 15, color: '#9fb0c0', marginTop: 4, marginBottom: 24 },
  cartao: {
    backgroundColor: '#1f3446',
    borderRadius: 14,
    padding: 22,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#2c4b63',
  },
  cartaoLabel: { fontSize: 14, color: '#9fb0c0' },
  cartaoSaldo: { fontSize: 38, fontWeight: '700', color: '#ffffff', marginTop: 4 },
  label: { fontSize: 15, fontWeight: '600', color: '#ffffff', marginBottom: 6 },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 18,
    color: '#14202b',
  },
  inputErro: { borderColor: '#ff6b5e' },
  erro: { color: '#ff8a80', marginTop: 10, fontSize: 14 },
  sucesso: { color: '#7bd89a', marginTop: 10, fontSize: 14 },
  botoes: { flexDirection: 'row', gap: 12, marginTop: 20 },
  botao: { flex: 1, paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  botaoDepositar: { backgroundColor: '#2f9e5b' },
  botaoSacar: { backgroundColor: '#d9663a' },
  pressionado: { opacity: 0.8 },
  botaoTexto: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
  botaoLink: { alignItems: 'center', marginTop: 24, padding: 8 },
  botaoLinkTexto: { color: '#9fb0c0', fontSize: 15, textDecorationLine: 'underline' },
});