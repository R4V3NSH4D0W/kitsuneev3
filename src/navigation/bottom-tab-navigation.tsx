import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/home-screen';
import Icons from 'react-native-vector-icons/Ionicons';
import AAText from '../ui/text';
import {Platform, View} from 'react-native';
import FIcons from 'react-native-vector-icons/FontAwesome';
import Profile from '../screens/profile';
import {useTheme} from '../wrappers/theme-context';
import {Colors} from '../constants/constants';

interface IIconsProps {
  color: string;
  size: number;
}

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
const HomeIcon = ({color, size}: IIconsProps) => (
  <Icons name="home-outline" size={size} color={color} />
);

const CalendarIcon = ({color, size}: IIconsProps) => (
  <Icons name="calendar-outline" size={size} color={color} />
);

const MyListIcon = ({color, size}: IIconsProps) => (
  <Icons name="bookmark-outline" size={size} color={color} />
);

const ProfileIcon = ({color, size}: IIconsProps) => (
  <FIcons name="user-o" size={size} color={color} />
);

const BottomTabNavigation = () => {
  const {theme} = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.Green,
        tabBarStyle: {
          paddingTop: Platform.OS === 'ios' ? 10 : 0,
          shadowColor: '#000',
          height: Platform.OS === 'ios' ? 80 : 60,
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
          tabBarIcon: HomeIcon,
        }}
      />
      <Tab.Screen
        name="Release Cale.."
        component={Calender}
        options={{
          tabBarIcon: CalendarIcon,
        }}
      />
      <Tab.Screen
        name="My List"
        component={MyList}
        options={{
          tabBarIcon: MyListIcon,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ProfileIcon,
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigation;
