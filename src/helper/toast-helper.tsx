import Toast from 'react-native-toast-message';

export const showToast = (
  type: 'success' | 'error' | 'info',
  text1: string,
  text2?: string,
  duration: number = 1000,
) => {
  Toast.show({
    type: type,
    text1: text1,
    text2: text2,
    visibilityTime: duration,
  });
};
