import React, { useContext } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { AuthContext } from '../utils/auth';

export default function ProtectedRoute({ allowedRoles, children }) {
  const { role, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#d32f2f" />
      </View>
    );
  }
  if (!allowedRoles.includes(role)) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>🚫 Unauthorized</Text>
      </View>
    );
  }
  return children;
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text:  { color: '#000', fontSize: 16 }
});
