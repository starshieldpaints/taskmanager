import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button } from 'react-native-paper';
import SuperAdminDashboard from '../screens/Dashboard/SuperAdminDashboard';
import CreateTaskScreen from '../screens/Tasks/CreateTaskScreen';
import TaskDetailScreen from '../screens/Tasks/TaskDetailScreen';
import EditProfileScreen from '../screens/Profile/EditProfileScreen';
import { AuthContext } from '../utils/auth';

const Stack = createNativeStackNavigator();

export default function SuperAdminNavigator() {
  const { role } = useContext(AuthContext);
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
          title: 'Tasks',
          headerRight: () =>
            role === 'admin' || role === 'superadmin' ? (
              <Button
                mode="text"
                labelStyle={{ color: '#fff' }}
                onPress={() => navigation.navigate('CreateTask')}

              >
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
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ title: 'Edit Profile' }}
      />
    </Stack.Navigator>
  );
}
