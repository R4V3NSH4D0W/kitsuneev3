import {View} from 'react-native';
import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {useTheme} from '../../wrappers/theme-context';

export default function SkeletonSchedule() {
  const {theme} = useTheme();
  return (
    <SkeletonPlaceholder
      backgroundColor={theme.colors.skeletonBackgroung}
      highlightColor={theme.colors.skeletonHighlight}>
      <View style={{padding: 20}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View
            style={{
              flex: 1,
              height: 20,
              backgroundColor: theme.colors.skeletonHighlight,
              marginRight: 10,
            }}
          />
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View
              style={{
                width: 30,
                height: 20,
                backgroundColor: theme.colors.skeletonHighlight,
                marginRight: 10,
              }}
            />
            <View
              style={{
                width: 30,
                height: 20,
                backgroundColor: theme.colors.skeletonHighlight,
              }}
            />
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 20,
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              width: 100,
              height: 20,
              backgroundColor: theme.colors.skeletonHighlight,
            }}
          />
          <View
            style={{
              width: 100,
              height: 20,
              backgroundColor: theme.colors.skeletonHighlight,
            }}
          />
        </View>
      </View>
    </SkeletonPlaceholder>
  );
}
