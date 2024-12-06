import {StyleSheet, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {RouteProp} from '@react-navigation/native';
import {IEpisodeSource, RootStackParamList} from '../constants/types';
import LayoutWrapper from '../wrappers/layout-wrapper';
import AAText from '../ui/text';
import {getEpisodeSource} from '../helper/api.helper';

type IVideoScreenProps = {
  route: RouteProp<RootStackParamList, 'VideoScreen'>;
};

export default function VideoScreen({route}: IVideoScreenProps) {
  const id = route.params.id;
  const [episodeSource, setEpisodeSource] = useState<IEpisodeSource[] | null>(
    null,
  );
  console.log('episodeSource:', episodeSource);

  const fetchEpisodeSource = useCallback(async () => {
    try {
      const response = await getEpisodeSource(id);
      setEpisodeSource(response);
    } catch (error) {
      console.error('Error fetching episode source:', error);
    }
  }, [id]);

  useEffect(() => {
    fetchEpisodeSource();
  }, [fetchEpisodeSource]);

  return (
    <LayoutWrapper>
      <View style={styles.container}>
        <AAText>{id}</AAText>
      </View>
    </LayoutWrapper>
  );
}

const styles = StyleSheet.create({
  container: {},
});
