import {
  StyleSheet,
  View,
  ActivityIndicator,
  Image,
  Linking,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import LayoutWrapper from '../wrappers/layout-wrapper';
import AAText from '../ui/text';
import {checkForUpdate} from '../helper/update-app-helper';
import {Colors, FontSize} from '../constants/constants';
import AAButton from '../ui/button';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../constants/types';
import {getCurrentAppVersion} from '../helper/util.helper';

type UpdateScreenProps = {
  route: RouteProp<RootStackParamList, 'UpdateScreen'>;
};

export default function UpdateScreen({route}: UpdateScreenProps) {
  const {onSkipUpdate = () => {}} = route.params;
  const [loading, setLoading] = useState<boolean>(true);
  const [updateInfo, setUpdateInfo] = useState<any>(null);

  useEffect(() => {
    const fetchUpdateInfo = async () => {
      const result = await checkForUpdate(getCurrentAppVersion);
      setUpdateInfo(result);
      setLoading(false);
    };

    fetchUpdateInfo();
  }, []);

  const redirectToDownload = async () => {
    const apkUrl = updateInfo?.downloadUrl;

    try {
      await Linking.openURL(apkUrl);
    } catch (error) {
      Alert.alert(
        'Download Failed',
        'Failed to open download link. Please try again.',
      );
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
            title="Redirect to Download"
            ignoreTheme
            style={styles.button}
            textStyle={{fontSize: FontSize.xmd, color: Colors.White}}
            onPress={() => {
              redirectToDownload();
            }}
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
});
