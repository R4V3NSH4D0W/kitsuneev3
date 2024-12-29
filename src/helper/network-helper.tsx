import NetInfo from '@react-native-community/netinfo';

export const checkInternetConnection = async (): Promise<boolean> => {
  const state = await NetInfo.fetch();
  const isConnected =
    (state.isConnected ?? false) && (state.isInternetReachable ?? true);
  return isConnected;
};

export const subscribeToInternetConnection = (
  callback: (isConnected: boolean) => void,
): (() => void) => {
  const unsubscribe = NetInfo.addEventListener(state => {
    const isConnected =
      (state.isConnected ?? false) && (state.isInternetReachable ?? true);
    callback(isConnected);
  });
  return unsubscribe;
};
