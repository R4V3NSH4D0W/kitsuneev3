import React, {useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import BottomTabNavigation from './bottom-tab-navigation';
import DetailScreen from '../screens/detail-screen';
import {RootStackParamList} from '../constants/types';
import VideoScreen from '../screens/video-screen';
import SearchScreen from '../screens/search-screen';
import SortAndFilter from '../screens/sort-and-filter-screen';
import SeeAllScreen from '../screens/see-all-screen';
import {getZoroWorking} from '../helper/api.helper';

import InitalLoading from '../screens/util-screen/inital-screen';
import ErrorScreen from '../screens/util-screen/404-screen';

const Stack = createStackNavigator<RootStackParamList>();

export default function StackNavigation() {
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<{isWorking: boolean} | null>(null);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const response = await getZoroWorking();
      setResult(response);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return <InitalLoading />;
  }
  const isWorking = result?.isWorking === true;

  if (!isWorking) {
    return <ErrorScreen />;
  }
  return (
    <Stack.Navigator screenOptions={{headerShown: false, animation: 'fade'}}>
      <Stack.Screen name="Tabs" component={BottomTabNavigation} />
      <Stack.Screen name="Detail" component={DetailScreen} />
      <Stack.Screen name="VideoScreen" component={VideoScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="SortAndFilter" component={SortAndFilter} />
      <Stack.Screen name="SeeAll" component={SeeAllScreen} />
    </Stack.Navigator>
  );
}
