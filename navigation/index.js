// navigation/index.js
import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator } from 'react-native';
import { AuthContext } from '../utils/auth';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import VerifyScreen from '../screens/Auth/VerifyScreen';
// import your other navigators / screens here:
// Use extensionless import so Metro can resolve the file on all platforms
import TaskTabs from './TaskTabs';               // e.g. your user tabs

import AdminNavigator from './AdminNavigator';       // your admin stack
import SuperAdminNavigator from './SuperAdminNavigator'; // your superadmin stack

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { user, role, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#d32f2f" />
      </View>
    );
  }

  if (!user) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Verify" component={VerifyScreen} />
      </Stack.Navigator>
    );
  }

  switch (role) {
    case 'admin':
      return <AdminNavigator />;
    case 'superadmin':
      return <SuperAdminNavigator />;
    default:
      return <TaskTabs />;
  }
}
