import React from 'react';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
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

export default createBottomTabNavigator({
  HomeStack,
  MapStack,
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
