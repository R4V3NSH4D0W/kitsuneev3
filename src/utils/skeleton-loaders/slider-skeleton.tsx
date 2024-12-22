/* eslint-disable react-native/no-inline-styles */
import {View} from 'react-native';
import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {useTheme} from '../../wrappers/theme-context';

export default function SkeletonSlider() {
  const {theme} = useTheme();
  return (
    <SkeletonPlaceholder
      backgroundColor={theme.colors.skeletonBackgroung}
      highlightColor={theme.colors.skeletonHighlight}>
      <View style={{width: '100%', height: 250}} />
    </SkeletonPlaceholder>
  );
}
