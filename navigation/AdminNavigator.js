import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AdminDashboard from '../screens/Dashboard/AdminDashboard';
import CreateTaskScreen from '../screens/Tasks/CreateTaskScreen';
import AssignTaskScreen from '../screens/Tasks/AssignTaskScreen';
import TaskDetailScreen from '../screens/Tasks/TaskDetailScreen';

const Stack = createNativeStackNavigator();

export default function AdminNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
      <Stack.Screen name="CreateTask" component={CreateTaskScreen} />
      <Stack.Screen name="AssignTask" component={AssignTaskScreen} />
      <Stack.Screen name="TaskDetail" component={TaskDetailScreen} />
    </Stack.Navigator>
  );
}
