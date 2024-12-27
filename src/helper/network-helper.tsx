import NetInfo from '@react-native-community/netinfo';

export const checkInternetConnection = async (): Promise<boolean> => {
  const state = await NetInfo.fetch();
  return state.isConnected ?? false;
};

export const subscribeToInternetConnection = (
  callback: (isConnected: boolean) => void,
): (() => void) => {
  const unsubscribe = NetInfo.addEventListener(state => {
    callback(state.isConnected ?? false);
  });
  return unsubscribe;
};
