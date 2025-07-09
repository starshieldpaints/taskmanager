import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button } from 'react-native-paper';
import SuperAdminDashboard from '../screens/Dashboard/SuperAdminDashboard';
import CreateTaskScreen from '../screens/Tasks/CreateTaskScreen';
import TaskDetailScreen from '../screens/Tasks/TaskDetailScreen';

const Stack = createNativeStackNavigator();

export default function SuperAdminNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#D32F2F' },
        headerTintColor: '#fff',
      }}
    >
      <Stack.Screen
        name="SuperAdminDash"
        component={SuperAdminDashboard}
        options={({ navigation }) => ({
          title: 'Super Admin Dashboard',
          headerRight: () => (
            <Button onPress={() => navigation.navigate('CreateTask')} color="#fff">
              Create
            </Button>
          ),
        })}
      />
      <Stack.Screen
        name="CreateTask"
        component={CreateTaskScreen}
        options={{ title: 'Create Task' }}
      />
      <Stack.Screen
        name="TaskDetail"
        component={TaskDetailScreen}
        options={{ title: 'Task Detail' }}
      />
    </Stack.Navigator>
  );
}
