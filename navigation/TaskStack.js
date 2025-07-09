import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button } from 'react-native-paper';
import { AuthContext } from '../utils/auth';
import TaskBoard from '../screens/Tasks/TaskBoard';
import CreateTaskScreen from '../screens/Tasks/CreateTaskScreen';
import TaskDetailScreen from '../screens/Tasks/TaskDetailScreen';

const Stack = createNativeStackNavigator();

export default function TaskStack() {
  const { role } = useContext(AuthContext);
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#D32F2F' },
        headerTintColor: '#fff',
      }}
    >
      <Stack.Screen
        name="TaskBoard"
        component={TaskBoard}
        options={({ navigation }) => ({
          title: 'Tasks',
          headerRight: () =>
            role === 'admin' || role === 'superadmin' ? (
              <Button onPress={() => navigation.navigate('CreateTask')} color="#fff">
                Create
              </Button>
            ) : null,
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
