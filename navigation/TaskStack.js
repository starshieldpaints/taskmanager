import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TaskBoard from '../screens/Tasks/TaskBoard';
import TaskDetailScreen from '../screens/Tasks/TaskDetailScreen';

const Stack = createNativeStackNavigator();

export default function TaskStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TaskBoard" component={TaskBoard} />
      <Stack.Screen name="TaskDetail" component={TaskDetailScreen} />
    </Stack.Navigator>
  );
}
