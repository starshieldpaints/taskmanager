import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthProvider } from '../utils/auth';

import TaskBoard          from '../screens/Tasks/TaskBoard';
import ProfileScreen      from '../screens/ProfileScreen';
import UserDashboard      from '../screens/Dashboard/UserDashboard';
import AdminDashboard     from '../screens/Dashboard/AdminDashboard';
import SuperAdminDashboard from '../screens/Dashboard/SuperAdminDashboard.js';

import ProtectedRoute     from '../components/ProtectedRoute';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Tab.Navigator screenOptions={{ headerShown:false }}>
          <Tab.Screen name="Tasks"    component={TaskBoard} />
          <Tab.Screen name="Profile"  component={ProfileScreen} />

          <Tab.Screen name="UserDash">
            {() => (
              <ProtectedRoute allowedRoles={['user','admin','superadmin']}>
                <UserDashboard/>
              </ProtectedRoute>
            )}
          </Tab.Screen>

          <Tab.Screen name="AdminDash">
            {() => (
              <ProtectedRoute allowedRoles={['admin','superadmin']}>
                <AdminDashboard/>
              </ProtectedRoute>
            )}
          </Tab.Screen>

          <Tab.Screen name="SuperDash">
            {() => (
              <ProtectedRoute allowedRoles={['superadmin']}>
                <SuperAdminDashboard/>
              </ProtectedRoute>
            )}
          </Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
