/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/home-screen';
import Icons from 'react-native-vector-icons/Ionicons';
import {
  Platform,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import FIcons from 'react-native-vector-icons/FontAwesome';
import Profile from '../screens/profile';
import {useTheme} from '../wrappers/theme-context';
import {Colors} from '../constants/constants';

import MyList from '../screens/my-list-screen';
import CalendarScreen from '../screens/calendar-screen';
import {useContinueWatching} from '../helper/storage.helper';
import AAText from '../ui/text';
import IIcons from 'react-native-vector-icons/Ionicons';
import EIcons from 'react-native-vector-icons/Entypo';
import {trimTitle} from '../helper/util.helper';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
interface IIconsProps {
  color: string;
  size: number;
}

const Tab = createBottomTabNavigator();

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
  const {continueWatching, removeContinueWatching} = useContinueWatching();

  const navigation = useNavigation<StackNavigationProp<any>>();

  return (
    <View style={{flex: 1}}>
      {continueWatching && (
        <View
          style={[
            styles.continueWatchingContainer,
            {backgroundColor: theme.colors.background},
          ]}>
          <View style={styles.continueWatchingContent}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('VideoScreen', {
                  id: continueWatching.id,
                  episodeNumber: continueWatching.episodeNumber,
                })
              }
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: '92%',
              }}>
              <Image
                source={{uri: continueWatching.image}}
                style={styles.continueWatchingImage}
              />
              <View>
                <AAText>{trimTitle(continueWatching.name, 25)}</AAText>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 5,
                  }}>
                  <IIcons name="play" size={16} color={Colors.Pink} />
                  <AAText
                    ignoretheme
                    style={{fontSize: 12, color: Colors.Pink}}>
                    Continue
                  </AAText>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                removeContinueWatching();
              }}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
              style={{width: '10%'}}>
              <EIcons name="cross" size={26} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Bottom Tab Navigator */}
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: Colors.Pink,
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
          tabBarLabelStyle: {
            fontFamily: 'Poppins-Medium',
            marginTop: 2,
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
          name="Schedule"
          component={CalendarScreen}
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
    </View>
  );
};

const styles = StyleSheet.create({
  continueWatchingContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 80 : 60,
    zIndex: 100,
    padding: 10,
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  continueWatchingTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  continueWatchingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    paddingHorizontal: 10,
  },
  continueWatchingImage: {
    width: 80,
    height: 60,
    borderRadius: 12,
    marginRight: 10,
  },
  continueWatchingText: {
    fontSize: 14,
  },
});

export default BottomTabNavigation;
