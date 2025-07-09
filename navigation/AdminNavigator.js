import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button } from 'react-native-paper';
import AdminDashboard from '../screens/Dashboard/AdminDashboard';
import CreateTaskScreen from '../screens/Tasks/CreateTaskScreen';
import AssignTaskScreen from '../screens/Tasks/AssignTaskScreen';
import TaskDetailScreen from '../screens/Tasks/TaskDetailScreen';
import EditProfileScreen from '../screens/Profile/EditProfileScreen';
import { AuthContext } from '../utils/auth';

const Stack = createNativeStackNavigator();

export default function AdminNavigator() {
  const { role } = useContext(AuthContext);
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
          headerRight: () =>
            (role === 'admin' || role === 'superadmin') ? (
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
      <Stack.Screen name="AssignTask" component={AssignTaskScreen} />
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
