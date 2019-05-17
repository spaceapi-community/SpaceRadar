import React from 'react';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import SettingsScreen from '../screens/SettingsScreen';
import SpaceScreen from '../screens/SpaceScreen';

const HomeStack = createStackNavigator({
  Home: HomeScreen,
  SpaceDetails: SpaceScreen,
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Spaces',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={'view-list'}
    />
  ),
};

const MapStack = createStackNavigator({
  Map: MapScreen,
});

MapStack.navigationOptions = {
  tabBarLabel: 'Map',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={'map'}
    />
  ),
};

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
});

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={'cogs'}
    />
  ),
};

export default createBottomTabNavigator({
  HomeStack,
  MapStack,
  // SettingsStack,
}, {
  tabBarOptions: {
    activeTintColor: '#333',
    labelStyle: {
      fontSize: 12,
    },
    style: {
      backgroundColor: '#ccc',
    },
  }
});
