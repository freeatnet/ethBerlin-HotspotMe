import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import ConnectScreen from '../screens/ConnectScreen';
import WalletScreen from '../screens/WalletScreen';
import ProvideScreen from '../screens/ProvideScreen';
import LinksScreen from '../screens/LinksScreen';
import SettingsScreen from '../screens/SettingsScreen';

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

const ConnectStack = createStackNavigator(
  {
    Connect: ConnectScreen,
  },
  config
);
ConnectStack.navigationOptions = {
  tabBarLabel: 'Connect',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
};
ConnectStack.path = '';

const ProvideStack = createStackNavigator(
  {
    Connect: ProvideScreen,
  },
  config
);
ProvideStack.navigationOptions = {
  tabBarLabel: 'Provide',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
};
ProvideStack.path = '';

const LinksStack = createStackNavigator(
  {
    Links: LinksScreen,
  },
  config
);
LinksStack.navigationOptions = {
  tabBarLabel: 'Links',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'} />
  ),
};
LinksStack.path = '';

const WalletStack = createStackNavigator(
  {
    Wallet: WalletScreen,
  },
  config
);
WalletStack.navigationOptions = {
  tabBarLabel: 'Wallet',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-cash' : 'md-cash'} />
  ),
};
WalletStack.path = '';

const SettingsStack = createStackNavigator(
  {
    Settings: SettingsScreen,
  },
  config
);
SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'} />
  ),
};
SettingsStack.path = '';

const tabNavigator = createBottomTabNavigator({
  ConnectStack,
  ProvideStack,
  WalletStack,
  SettingsStack,
});

tabNavigator.path = '';

export default tabNavigator;
