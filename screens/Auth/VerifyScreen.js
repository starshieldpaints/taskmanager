// screens/Auth/VerifyScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  sendVerificationEmailToUser,
  reloadCurrentUser,
  logout,
} from '../../utils/auth';
import { auth } from '../../firebase/config';

export default function VerifyScreen({ navigation }) {
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await reloadCurrentUser();
        if (auth.currentUser?.emailVerified) {
          clearInterval(interval);
          navigation.replace('Tasks');
        }
      } catch (e) {
        console.warn('Reload error:', e);
      } finally {
        setChecking(false);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [navigation]);

  const onResend = async () => {
    try {
      await sendVerificationEmailToUser();
      Alert.alert('Verification email sent.');
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.message}>
        Please verify your email to continue.
      </Text>
      <Button title="Resend Verification" onPress={onResend} />
      <View style={styles.spacer} />
      <Button
        title="Log Out"
        color="#d32f2f"
        onPress={async () => {
          await logout();
          navigation.replace('Login');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  spacer: {
    height: 12,
  },
});
