import NetInfo from '@react-native-community/netinfo';

export const checkInternetConnection = async (): Promise<boolean> => {
  const state = await NetInfo.fetch();
  return (state.isConnected && state.isInternetReachable) ?? false;
};

export const subscribeToInternetConnection = (
  callback: (isConnected: boolean) => void,
): (() => void) => {
  const unsubscribe = NetInfo.addEventListener(state => {
    const isConnected =
      (state.isConnected && state.isInternetReachable) ?? false;
    callback(isConnected);
  });
  return unsubscribe;
};
