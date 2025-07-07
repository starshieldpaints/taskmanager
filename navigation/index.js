// navigation/index.js
import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../utils/auth';
import LoginScreen from '../screens/Auth/LoginScreen';
// import your other navigators / screens here:
import TaskTabs from './TaskTabs';            // e.g. your user tabs
import AdminNavigator from './AdminNavigator';       // your admin stack
import SuperAdminNavigator from './SuperAdminNavigator'; // your superadmin stack

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { user, role, loading } = useContext(AuthContext);

  if (loading) return null;  // or a Splash screen

  if (!user) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
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
