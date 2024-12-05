import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/home-screen';
import Icons from 'react-native-vector-icons/Ionicons';
import AAText from '../ui/text';
import {View} from 'react-native';
import FIcons from 'react-native-vector-icons/FontAwesome';
import Profile from '../screens/profile';
import {useTheme} from '../wrappers/theme-context';
import {Colors} from '../constants/constants';

const Tab = createBottomTabNavigator();

const Calender = () => {
  return (
    <View>
      <AAText>Calender</AAText>
    </View>
  );
};

const MyList = () => {
  return (
    <View>
      <AAText>MyList</AAText>
    </View>
  );
};
const BottomTabNavigation = () => {
  const {theme} = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.Green,
        tabBarStyle: {
          //   position: 'absolute',
          //   borderTopLeftRadius: 20,
          //   borderTopRightRadius: 20,
          paddingTop: 10,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowOffset: {width: 0, height: -3},
          shadowRadius: 5,
          elevation: 5,
          backgroundColor: theme.colors.background,
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Release Cale.."
        component={Calender}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="My List"
        component={MyList}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icons name="bookmark-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({color, size}) => (
            <FIcons name="user-o" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigation;
