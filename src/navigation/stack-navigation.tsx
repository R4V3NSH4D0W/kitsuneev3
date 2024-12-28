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

import {getZoroWorking} from '../helper/api.helper';
import {checkInternetConnection} from '../helper/network-helper';

import {RootStackParamList} from '../constants/types';
import BottomTabNavigation from './bottom-tab-navigation';

const Stack = createStackNavigator<RootStackParamList>();

export default function StackNavigation() {
  const [loading, setLoading] = useState<boolean>(true);
  const [connected, setConnected] = useState<boolean | null>(null);
  const [result, setResult] = useState<{isWorking: boolean}>({isWorking: true});

  const currentVersion = '0.0.1';
  const [latestVersion, setLatestVersion] = useState<string | null>(null);
  console.log(latestVersion);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  console.log(isUpdateAvailable);
  useEffect(() => {
    const fetchLatestVersion = async () => {
      try {
        const response = await fetch(
          'https://api.github.com/repos/R4V3NSH4D0W/kitsuneev3/releases/latest',
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch latest version: ${response.status}`);
        }
        const responseData = await response.json();
        const latestTag = responseData.tag_name;
        setLatestVersion(latestTag);

        // Compare versions
        if (compareVersions(currentVersion, latestTag)) {
          setIsUpdateAvailable(true);
        }
      } catch (error) {
        console.error('Error fetching latest version:', error);
      }
    };

    fetchLatestVersion();
  }, []);

  // Function to compare versions (semver compatible)
  const compareVersions = (current: string, latest: string): boolean => {
    const currentParts = current.split('.').map(Number);
    const latestParts = latest.split('.').map(Number);

    for (
      let i = 0;
      i < Math.max(currentParts.length, latestParts.length);
      i++
    ) {
      const currentPart = currentParts[i] || 0;
      const latestPart = latestParts[i] || 0;

      if (currentPart < latestPart) return true; // Update required
      if (currentPart > latestPart) return false; // Already updated
    }
    return false; // Versions are equal
  };

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
  }, []);

  useEffect(() => {
    if (connected === true) {
      fetchData();
    }
  }, [connected]);

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

  if (isUpdateAvailable) {
    console.warn(`A new version (${latestVersion}) is available!`);
  }

  return (
    <>
      <InternetConnection />
      <Stack.Navigator screenOptions={{headerShown: false, animation: 'fade'}}>
        <Stack.Screen name="Tabs" component={BottomTabNavigation} />
        <Stack.Screen name="Detail" component={DetailScreen} />
        <Stack.Screen name="VideoScreen" component={VideoScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="SortAndFilter" component={SortAndFilter} />
        <Stack.Screen name="SeeAll" component={SeeAllScreen} />
      </Stack.Navigator>
    </>
  );
}
