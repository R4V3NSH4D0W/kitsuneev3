import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/home-screen';
import Icons from 'react-native-vector-icons/Ionicons';
import {View, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {useTheme} from '../wrappers/theme-context';
import {Colors, FontSize} from '../constants/constants';

import MyList from '../screens/my-list-screen';
import CalendarScreen from '../screens/calendar-screen';
import {useContinueWatching} from '../helper/storage.helper';
import AAText from '../ui/text';
import EIcons from 'react-native-vector-icons/Entypo';
import {trimTitle} from '../helper/util.helper';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Settings from '../screens/settings';

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

const SettingIcon = ({color, size}: IIconsProps) => (
  <Icons name="settings-outline" size={size} color={color} />
);

const BottomTabNavigation = () => {
  const {theme} = useTheme();
  const {continueWatching, removeContinueWatching} = useContinueWatching();

  const navigation = useNavigation<StackNavigationProp<any>>();

  return (
    <View style={styles.container}>
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
              style={styles.continueWatchingTouch}>
              <Image
                source={{uri: continueWatching.image}}
                style={styles.continueWatchingImage}
              />
              <View>
                <AAText style={styles.continueWatchingTitle}>
                  {trimTitle(continueWatching.name, 25)}
                </AAText>
                <View style={styles.continueWatchingActions}>
                  <Icons name="play" size={FontSize.sm} color={Colors.Pink} />
                  <AAText ignoretheme style={styles.continueWatchingText}>
                    Continue
                  </AAText>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={removeContinueWatching}
              hitSlop={styles.hitSlop}
              style={styles.closeButton}>
              <EIcons name="cross" size={26} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: Colors.Pink,
          tabBarStyle: {
            paddingTop: 10,
            shadowColor: '#000',
            height: 80,
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
          lazy: false,
        }}>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{tabBarIcon: HomeIcon}}
        />
        <Tab.Screen
          name="Schedule"
          component={CalendarScreen}
          options={{tabBarIcon: CalendarIcon}}
        />
        <Tab.Screen
          name="My List"
          component={MyList}
          options={{tabBarIcon: MyListIcon}}
        />
        <Tab.Screen
          name="Settings"
          component={Settings}
          options={{tabBarIcon: SettingIcon}}
        />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  continueWatchingContainer: {
    position: 'absolute',
    bottom: 80,
    zIndex: 100,
    padding: 10,
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  continueWatchingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    paddingHorizontal: 10,
  },
  continueWatchingTouch: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '92%',
  },
  continueWatchingImage: {
    width: 80,
    height: 60,
    borderRadius: 12,
    marginRight: 10,
  },
  continueWatchingTitle: {
    fontSize: FontSize.sm,
    fontFamily: 'Poppins-SemiBold',
  },
  continueWatchingActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  continueWatchingText: {
    fontSize: FontSize.xs,
    color: Colors.Pink,
  },
  closeButton: {width: '10%'},
  hitSlop: {top: 10, bottom: 10, left: 10, right: 10},
});

export default BottomTabNavigation;
