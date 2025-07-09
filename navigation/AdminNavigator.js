import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button } from 'react-native-paper';
import AdminDashboard from '../screens/Dashboard/AdminDashboard';
import CreateTaskScreen from '../screens/Tasks/CreateTaskScreen';
import AssignTaskScreen from '../screens/Tasks/AssignTaskScreen';
import TaskDetailScreen from '../screens/Tasks/TaskDetailScreen';

const Stack = createNativeStackNavigator();

export default function AdminNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#D32F2F' },
        headerTintColor: '#fff',
      }}
    >
      <Stack.Screen
        name="AdminDash"
        component={AdminDashboard}
        options={({ navigation }) => ({
          title: 'Admin Dashboard',
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
      <Stack.Screen name="AssignTask" component={AssignTaskScreen} />
      <Stack.Screen
        name="TaskDetail"
        component={TaskDetailScreen}
        options={{ title: 'Task Detail' }}
      />
    </Stack.Navigator>
  );
}
