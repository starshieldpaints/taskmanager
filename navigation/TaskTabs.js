import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Button, IconButton } from 'react-native-paper';
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
                mode="text"
                labelStyle={{ color: '#fff' }}
                onPress={() => navigation.navigate('Tasks', { screen: 'CreateTask' })}

              >
                Create
              </Button>
            ) : null,
        })}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={({ navigation }) => ({
          headerRight: () => (
            <IconButton
              icon="pencil"
              size={24}
              iconColor="#fff"
              onPress={() => navigation.navigate('Profile', { screen: 'EditProfile' })}
            />
          )
        })}
      />
    </Tab.Navigator>
  );
}
