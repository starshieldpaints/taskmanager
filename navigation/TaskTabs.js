import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Button } from 'react-native-paper';
import TaskStack from './TaskStack';
import ProfileStack from './ProfileStack';
import { AuthContext } from '../utils/auth';

const Tab = createBottomTabNavigator();

export default function TaskTabs() {
  const { role } = useContext(AuthContext);

  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#D32F2F' },
        headerTintColor: '#fff',
      }}
    >
      <Tab.Screen
        name="Tasks"
        component={TaskStack}
        options={({ navigation }) => ({
          headerTitle: 'Tasks',
          headerRight: () =>
            ['admin', 'superadmin'].includes(role) ? (
              <Button
                mode="contained"
                onPress={() => navigation.navigate('Tasks', { screen: 'CreateTask' })}
                style={{ backgroundColor: '#D32F2F' }}
                labelStyle={{ color: '#fff' }}
              >
                Create
              </Button>
            ) : null,
        })}
      />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
}
