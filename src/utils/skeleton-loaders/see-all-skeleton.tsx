/* eslint-disable react-native/no-inline-styles */
import {View} from 'react-native';
import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {useTheme} from '../../wrappers/theme-context';

export default function SeeAllSkeleton() {
  const {theme} = useTheme();
  const skeletonItems = Array(7).fill(null);
  return (
    <SkeletonPlaceholder
      backgroundColor={theme.colors.skeletonBackground}
      highlightColor={theme.colors.skeletonHighlight}>
      <View style={{gap: 10}}>
        {skeletonItems.map((_, index) => (
          <View
            key={index}
            style={{
              flexDirection: 'row',
              gap: 10,
            }}>
            <View
              style={{
                height: 140,
                width: 140,
                borderRadius: 8,
              }}
            />
            <View style={{marginTop: 20, gap: 10}}>
              <View style={{height: 20, width: 120, borderRadius: 5}} />
              <View style={{height: 20, width: 40, borderRadius: 5}} />
              <View style={{height: 20, width: 80, borderRadius: 5}} />
            </View>
          </View>
        ))}
      </View>
    </SkeletonPlaceholder>
  );
}
