import {
  StyleSheet,
  View,
  ActivityIndicator,
  Image,
  Animated,
  Dimensions,
  Alert,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import LayoutWrapper from '../wrappers/layout-wrapper';
import AAText from '../ui/text';
import {checkForUpdate} from '../helper/update-app-helper';
import {Colors, FontSize} from '../constants/constants';
import AAButton from '../ui/button';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../constants/types';
import * as Progress from 'react-native-progress';
import {useTheme} from '../wrappers/theme-context';
import RNFS from 'react-native-fs';
import SendIntent from 'react-native-send-intent';
import RNFetchBlob from 'rn-fetch-blob';
import {getCurrentAppVersion} from '../helper/util.helper';
import {requestPermissions} from '../helper/permission-helper';

type UpdateScreenProps = {
  route: RouteProp<RootStackParamList, 'UpdateScreen'>;
};

const {width} = Dimensions.get('window');

export default function UpdateScreen({route}: UpdateScreenProps) {
  const {onSkipUpdate = () => {}} = route.params;
  const [loading, setLoading] = useState<boolean>(true);
  const [updateInfo, setUpdateInfo] = useState<any>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const downloadAnim = useState(new Animated.Value(0))[0];
  const {theme} = useTheme();

  useEffect(() => {
    const fetchUpdateInfo = async () => {
      const result = await checkForUpdate(getCurrentAppVersion);
      setUpdateInfo(result);
      setLoading(false);
    };

    fetchUpdateInfo();
  }, []);
  const startDownloadAnimation = async () => {
    try {
      const hasPermissions = await requestPermissions();
      if (!hasPermissions) {
        Alert.alert(
          'Permission Required',
          'Please allow storage permission to proceed.',
        );
        return;
      }

      setIsDownloading(true);
      Animated.spring(downloadAnim, {
        toValue: 1,
        friction: 5,
        tension: 50,
        useNativeDriver: true,
      }).start();

      // Trigger file download
      if (updateInfo?.downloadUrl) {
        await downloadFile(updateInfo.downloadUrl);
      } else {
        Alert.alert('Error', 'Download URL is missing.');
      }
    } catch (error) {
      console.error('Error during download process:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const stopDownloadAnimation = () => {
    Animated.spring(downloadAnim, {
      toValue: 0,
      friction: 5,
      tension: 50,
      useNativeDriver: true,
    }).start();
    setIsDownloading(false);
  };

  const downloadFile = async (url: string) => {
    console.log('Requesting storage permission...');
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) {
      Alert.alert('Permission Required', 'Please allow storage permission');
      return;
    }

    const downloadDest = `${RNFS.DocumentDirectoryPath}/update.apk`;
    console.log('Download path:', downloadDest);

    try {
      const fileExists = await RNFS.exists(downloadDest);
      if (fileExists) {
        console.log('File already exists, deleting...');
        await RNFS.unlink(downloadDest);
      }
      const download = RNFS.downloadFile({
        fromUrl: url,
        toFile: downloadDest,
        headers: {
          'User-Agent': 'Mozilla/5.0',
          Accept: 'application/octet-stream',
        },
        progress: res => {
          const progress = res.bytesWritten / res.contentLength;
          console.log('Download progress:', progress);
          if (Math.abs(progress - downloadProgress) > 0.001) {
            setDownloadProgress(progress);
          }
        },
        progressDivider: 1,
      });

      await download.promise;
      console.log('Download complete:', downloadDest);
      stopDownloadAnimation();
      installAPK(downloadDest);
    } catch (error) {
      console.error('Download Error:', error);
      Alert.alert('Error', 'Failed to download the file. Please try again.');
      stopDownloadAnimation();
    }
  };

  const installAPK = async (downloadedFilePath: string) => {
    console.log('Installing APK:', downloadedFilePath);
    try {
      if (Platform.OS === 'android') {
        const fileUri = `file://${downloadedFilePath}`;
        const success = await SendIntent.openFileChooser(
          {
            fileUrl: fileUri,
            type: 'application/vnd.android.package-archive',
          },
          'com.android.packageinstaller',
        );

        if (success !== undefined && success) {
          await RNFetchBlob.fs.unlink(downloadedFilePath);
        } else {
          Alert.alert('Installation Error', 'Failed to install the update.');
        }
      } else {
        Alert.alert(
          'Unsupported Platform',
          'APK installation is supported only on Android devices.',
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to install the update.');
    }
  };

  if (loading) {
    return (
      <LayoutWrapper>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.Pink} />
        </View>
      </LayoutWrapper>
    );
  }

  return (
    <LayoutWrapper>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image source={require('../../assets/images/icon-256x256.png')} />
        </View>
        <AAText ignoretheme style={styles.updateText}>
          New Update Available
        </AAText>
        <AAText style={styles.versionText}>
          Version {updateInfo?.latestVersion}
        </AAText>
        <AAText>Release Notes:</AAText>
        <AAText style={styles.releaseNoteText}>
          {updateInfo?.releaseNotes}
        </AAText>
        <View style={styles.buttonContainer}>
          <AAButton
            title="Download"
            ignoreTheme
            style={styles.button}
            textStyle={{fontSize: FontSize.xmd, color: Colors.White}}
            onPress={startDownloadAnimation}
          />
          <AAButton
            ignoreTheme
            textStyle={{fontSize: FontSize.xmd, color: Colors.White}}
            style={[styles.button, {backgroundColor: Colors.LightGray}]}
            title="Skip"
            onPress={onSkipUpdate}
          />
        </View>
      </View>

      {isDownloading && (
        <Animated.View
          style={[
            styles.downloadingContainer,
            {
              opacity: downloadAnim,
              transform: [
                {
                  translateY: downloadAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [100, 0],
                  }),
                },
              ],
            },
            {
              backgroundColor: theme.colors.alt,
            },
          ]}>
          <View style={styles.downloadingContent}>
            <Progress.Bar
              progress={downloadProgress}
              width={width - 40}
              color={Colors.Pink}
            />
            <AAText style={styles.downloadingText}>Downloading...</AAText>
          </View>
        </Animated.View>
      )}
    </LayoutWrapper>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  releaseNoteText: {
    fontSize: FontSize.xs,
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  button: {
    width: '100%',
    marginTop: 10,
    borderWidth: 0,
    backgroundColor: Colors.Pink,
  },
  updateText: {
    fontSize: FontSize.xl,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Colors.Pink,
  },
  versionText: {
    fontSize: FontSize.md,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    width: '100%',
  },
  imageContainer: {
    alignItems: 'center',
  },
  downloadingContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 350,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  downloadingText: {
    marginTop: 10,
    fontSize: FontSize.md,
    color: Colors.Pink,
  },
  downloadingContent: {
    marginTop: 20,
  },
});
