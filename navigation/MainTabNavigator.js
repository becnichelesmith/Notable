import React from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TabNavigator, TabBarBottom } from 'react-navigation';

import Colors from '../constants/Colors';

import NotesScreen from '../screens/NotesScreen';
import CompareScreen from '../screens/CompareScreen';
import DrawScreen from '../screens/DrawScreen';


export default TabNavigator(
  {
    Notes: {
      screen: NotesScreen,
    },
    Draw: {
      screen: DrawScreen,
    },
    Compare: {
      screen: CompareScreen,
    },
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state;
        let iconName;
        // console.log("in navigation");
        switch (routeName) {
          case 'Notes':
            iconName =
              Platform.OS === 'ios'
                ? `ios-text${focused ? '' : '-outline'}`
                : 'md-text';
            break;
            case 'Draw':
              iconName =
                Platform.OS === 'ios'
                  ? `ios-brush${focused ? '' : '-outline'}`
                  : 'md-brush';
              break;
          case 'Compare':
            iconName =
              Platform.OS === 'ios'
                ? `ios-git-compare${focused ? '' : '-outline'}`
                : 'md-git-compare';
            break;
        }
        return (
          <Ionicons
            name={iconName}
            size={28}
            style={{ marginBottom: -3 }}
            color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
          />
        );
      },
    }),
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: false,
  }
);
