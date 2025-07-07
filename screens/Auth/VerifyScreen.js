import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { firebase } from '../../firebase/config';

export default function VerifyScreen({ navigation }) {
  const user = firebase.auth().currentUser;

  const sendVerification = async () => {
    try {
      await user.sendEmailVerification();
      Alert.alert('Verification email sent');
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      await user.reload();
      if (user.emailVerified) {
        clearInterval(interval);
        navigation.replace('Tasks');
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Text>Please verify your email to continue.</Text>
      <Button title="Resend Verification" onPress={sendVerification} />
      <Button title="Logout" onPress={() => firebase.auth().signOut()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  }
});
