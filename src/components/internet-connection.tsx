import React, {useEffect, useState} from 'react';
import {Text, StyleSheet, Animated, View} from 'react-native';
import FIcons from 'react-native-vector-icons/Feather';
import {subscribeToInternetConnection} from '../helper/network-helper';

const InternetConnection: React.FC = () => {
  const [bannerHeight] = useState(new Animated.Value(0));
  const [showRestoredMessage, setShowRestoredMessage] =
    useState<boolean>(false);
  const [previousConnectionStatus, setPreviousConnectionStatus] = useState<
    boolean | null
  >(null);

  useEffect(() => {
    const unsubscribe = subscribeToInternetConnection(status => {
      if (
        previousConnectionStatus !== null &&
        previousConnectionStatus === false &&
        status === true
      ) {
        Animated.timing(bannerHeight, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }).start(() => {
          setShowRestoredMessage(true);
          setTimeout(() => setShowRestoredMessage(false), 2000);
        });
      } else if (status === false) {
        Animated.timing(bannerHeight, {
          toValue: 40,
          duration: 300,
          useNativeDriver: false,
        }).start();
        setShowRestoredMessage(false);
      }
      setPreviousConnectionStatus(status);
    });

    return () => unsubscribe();
  }, [previousConnectionStatus, bannerHeight]);

  return (
    <>
      <Animated.View style={[styles.banner, {height: bannerHeight}]}>
        <FIcons name="wifi-off" size={20} color="#fff" />
        <Text style={styles.bannerText}>No Internet Connection</Text>
      </Animated.View>
      {showRestoredMessage && (
        <View style={styles.restoredBanner}>
          <FIcons name="wifi" size={20} color="#fff" />
          <Text style={styles.restoredText}>Connection Restored</Text>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#ff4d4d',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    overflow: 'hidden',
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  bannerText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  restoredBanner: {
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 120,
    flexDirection: 'row',
    padding: 10,
  },
  restoredText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default InternetConnection;
