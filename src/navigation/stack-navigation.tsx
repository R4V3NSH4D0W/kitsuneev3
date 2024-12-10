import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import BottomTabNavigation from './bottom-tab-navigation';
import DetailScreen from '../screens/detail-screen';
import {RootStackParamList} from '../constants/types';
import VideoScreen from '../screens/video-screen';
import SearchScreen from '../screens/search-screen';
import SortAndFilter from '../screens/sort-and-filter-screen';

const Stack = createStackNavigator<RootStackParamList>();

export default function StackNavigation() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Tabs" component={BottomTabNavigation} />
      <Stack.Screen name="Detail" component={DetailScreen} />
      <Stack.Screen name="VideoScreen" component={VideoScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="SortAndFilter" component={SortAndFilter} />
    </Stack.Navigator>
  );
}
