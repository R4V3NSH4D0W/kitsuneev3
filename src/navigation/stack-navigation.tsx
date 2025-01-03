import React, {useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import VideoScreen from '../screens/video-screen';
import DetailScreen from '../screens/detail-screen';
import SearchScreen from '../screens/search-screen';
import SeeAllScreen from '../screens/see-all-screen';
import ErrorScreen from '../screens/util-screen/404-screen';
import SortAndFilter from '../screens/sort-and-filter-screen';
import InitalLoading from '../screens/util-screen/inital-screen';
import NoInternetConnectionScreen from '../screens/util-screen/no-internet-connection-screen';
import InternetConnection from '../components/internet-connection';
import BottomTabNavigation from './bottom-tab-navigation';
import {getZoroWorking} from '../helper/api.helper';
import {checkInternetConnection} from '../helper/network-helper';
import {RootStackParamList} from '../constants/types';
import {checkForUpdate} from '../helper/update-app-helper';
import UpdateScreen from '../screens/update-app-screen';
import {getCurrentAppVersion} from '../helper/util.helper';

const Stack = createStackNavigator<RootStackParamList>();

export default function StackNavigation() {
  const [loading, setLoading] = useState<boolean>(true);
  const [connected, setConnected] = useState<boolean | null>(null);
  const [result, setResult] = useState<{isWorking: boolean}>({isWorking: true});
  const [isUpdateAvailable, setIsUpdateAvailable] = useState<boolean>(false);

  const [mounted, setMounted] = useState(false);
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getZoroWorking();
      setResult(response);
    } catch (error) {
      console.error('Error fetching Zoro working status:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkConnection = async () => {
    setLoading(true);
    const status = await checkInternetConnection();
    setConnected(status);
    setLoading(false);
  };

  useEffect(() => {
    checkConnection();
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && connected !== null) {
      fetchData();
      checkForUpdate(getCurrentAppVersion).then(updateInfo => {
        if (updateInfo.isUpdateAvailable) {
          setIsUpdateAvailable(true);
        }
      });
    }
  }, [mounted, connected]);

  if (loading) {
    return <InitalLoading />;
  }

  if (connected === false) {
    return (
      <NoInternetConnectionScreen onRetry={checkConnection} loading={loading} />
    );
  }

  const isWorking = result?.isWorking === true;

  if (!isWorking) {
    return <ErrorScreen />;
  }

  const handleSkipUpdate = () => {
    setIsUpdateAvailable(false);
  };

  return (
    <>
      <InternetConnection />
      <Stack.Navigator screenOptions={{headerShown: false, animation: 'fade'}}>
        {isUpdateAvailable ? (
          <Stack.Screen
            name="UpdateScreen"
            component={UpdateScreen}
            initialParams={{onSkipUpdate: handleSkipUpdate}}
          />
        ) : (
          <Stack.Screen name="Tabs" component={BottomTabNavigation} />
        )}
        <Stack.Screen name="Detail" component={DetailScreen} />
        <Stack.Screen name="VideoScreen" component={VideoScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="SortAndFilter" component={SortAndFilter} />
        <Stack.Screen name="SeeAll" component={SeeAllScreen} />
      </Stack.Navigator>
    </>
  );
}
