import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SuperAdminDashboard from '../screens/Dashboard/SuperAdminDashboard.js';

import TaskDetailScreen from '../screens/Tasks/TaskDetailScreen';

const Stack = createNativeStackNavigator();

export default function SuperAdminNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SuperAdminDashboard" component={SuperAdminDashboard} />
      <Stack.Screen name="TaskDetail" component={TaskDetailScreen} />
    </Stack.Navigator>
  );
}
