import {StyleSheet, View} from 'react-native';
import React from 'react';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../constants/types';
import LayoutWrapper from '../wrappers/layout-wrapper';
import AAText from '../ui/text';

type IVideoScreenProps = {
  route: RouteProp<RootStackParamList, 'VideoScreen'>;
};

export default function VideoScreen({route}: IVideoScreenProps) {
  const id = route.params.id;
  console.log(id);
  return (
    <LayoutWrapper>
      <View style={styles.container}>
        <AAText>Video Screen</AAText>
      </View>
    </LayoutWrapper>
  );
}

const styles = StyleSheet.create({
  container: {},
});
