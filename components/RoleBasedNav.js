import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthContext } from '../utils/auth';

import TaskBoard            from '../screens/Tasks/TaskBoard';
import ProfileScreen        from '../screens/ProfileScreen';
import UserDashboard        from '../screens/Dashboard/UserDashboard';
import AdminDashboard       from '../screens/Dashboard/AdminDashboard';
import SuperAdminDashboard  from '../screens/Dashboard/SuperAdminDashboard';

const Tab = createBottomTabNavigator();

export default function RoleBasedNav() {
  const { role } = useContext(AuthContext);

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Tasks"   component={TaskBoard} />
      <Tab.Screen name="Profile" component={ProfileScreen} />

      {/* Everyone with a role can see the User dashboard */}
      <Tab.Screen name="UserDash" component={UserDashboard} />

      {/* Admins and Superadmins */}
      {['admin','superadmin'].includes(role) && (
        <Tab.Screen name="AdminDash" component={AdminDashboard} />
      )}

      {/* Superadmins only */}
      {role === 'superadmin' && (
        <Tab.Screen name="SuperDash" component={SuperAdminDashboard} />
      )}
    </Tab.Navigator>
  );
}
