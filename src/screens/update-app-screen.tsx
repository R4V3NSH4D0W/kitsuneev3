import {StyleSheet, View, ActivityIndicator} from 'react-native';
import React, {useEffect, useState} from 'react';
import LayoutWrapper from '../wrappers/layout-wrapper';
import AAText from '../ui/text';
import {checkForUpdate} from '../helper/update-app-helper';
import {Colors, FontSize} from '../constants/constants';
import AAButton from '../ui/button';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../constants/types';

const currentAppVersion = '1.0.0';

type UpdateScreenProps = {
  route: RouteProp<RootStackParamList, 'UpdateScreen'>;
};

export default function UpdateScreen({route}: UpdateScreenProps) {
  const {onSkipUpdate} = route.params;
  const [loading, setLoading] = useState<boolean>(true);
  const [updateInfo, setUpdateInfo] = useState<any>(null);

  useEffect(() => {
    const fetchUpdateInfo = async () => {
      const result = await checkForUpdate(currentAppVersion);
      setUpdateInfo(result);
      setLoading(false);
    };

    fetchUpdateInfo();
  }, []);

  if (loading) {
    return (
      <LayoutWrapper>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </LayoutWrapper>
    );
  }

  return (
    <LayoutWrapper>
      <View style={styles.container}>
        <AAText ignoretheme style={styles.updateText}>
          Update Avilable
        </AAText>
        <AAText>Version {updateInfo?.latestVersion}</AAText>
        <AAText>Release Notes:</AAText>
        <AAText style={styles.releaseNoteText}>
          {updateInfo?.releaseNotes}
        </AAText>
        <AAButton
          title="Download"
          style={styles.button}
          textStyle={{fontSize: FontSize.xmd}}
          onPress={() => {
            if (updateInfo.downloadUrl) {
              console.log('Download URL:', updateInfo.downloadUrl);
            }
          }}
        />
        <AAButton
          style={[styles.button, {backgroundColor: Colors.LightGray}]}
          title="Skip"
          onPress={onSkipUpdate}
        />
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
    padding: 20,
  },
  releaseNoteText: {
    fontSize: FontSize.xs,
    lineHeight: 20,
  },
  button: {
    marginTop: 10,
    borderWidth: 0,
    backgroundColor: Colors.Pink,
  },
  updateText: {
    fontSize: FontSize.lg,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Colors.Pink,
  },
});
