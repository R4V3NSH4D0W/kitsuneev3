import {PermissionsAndroid} from 'react-native';

export const requestPermissions = async (): Promise<boolean> => {
  try {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    ]);
    return (
      granted['android.permission.WRITE_EXTERNAL_STORAGE'] ===
        PermissionsAndroid.RESULTS.GRANTED &&
      granted['android.permission.READ_EXTERNAL_STORAGE'] ===
        PermissionsAndroid.RESULTS.GRANTED
    );
  } catch (err) {
    console.error('Error requesting storage permission:', err);
    return false;
  }
};

// export const openInstallPermissionSettings = () => {
//   if (Platform.OS === 'android') {
//     const packageName = 'com.kitsunee';
//     const appSettingsUrl = `package:${packageName}`;

//     Linking.openURL(appSettingsUrl).catch(err => {
//       console.error('Failed to open settings:', err);
//     });
//   }
// };
