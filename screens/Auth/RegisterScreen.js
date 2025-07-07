import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native';
import { firebase } from '../../firebase/config';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    try {
      setLoading(true);
      const res = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);
      await firebase.firestore().collection('users').doc(res.user.uid).set({
        email,
        role: 'user',
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      navigation.replace('Tasks');
    } catch (e) {
      Alert.alert('Register Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#d32f2f" />
      ) : (
        <Button title="Register" onPress={handleRegister} color="#d32f2f" />
      )}
      <Button title="Back to Login" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
    padding: 10,
    borderRadius: 4
  }
});
