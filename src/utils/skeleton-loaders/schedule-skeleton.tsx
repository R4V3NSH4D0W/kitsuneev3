/* eslint-disable react-native/no-inline-styles */
import {Dimensions, View} from 'react-native';
import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {useTheme} from '../../wrappers/theme-context';
const {height} = Dimensions.get('window');

export default function SkeletonSchedule() {
  const {theme} = useTheme();

  // const skeletonItems = Array(5).fill(null);
  return (
    <SkeletonPlaceholder
      backgroundColor={theme.colors.skeletonBackground}
      highlightColor={theme.colors.skeletonHighlight}>
      <View style={{height: height}}>
        <View
          style={{
            paddingTop: 20,
            flexDirection: 'row',
            gap: 10,
            alignItems: 'center',
          }}>
          <View style={{borderWidth: 4, width: 20, borderRadius: 4}} />
          <View style={{height: 16, width: 40, borderRadius: 4}} />
        </View>
        {/* Render Schedule Section */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 20,
          }}>
          <View style={{height: 90, width: 120, borderRadius: 20}} />
          <View style={{width: '60%'}}>
            <View style={{width: '100%', height: 15, borderRadius: 4}} />
            <View
              style={{width: '10%', height: 12, borderRadius: 4, marginTop: 4}}
            />
            <View
              style={{width: '40%', height: 15, borderRadius: 4, marginTop: 4}}
            />
          </View>
        </View>
        <View
          style={{
            paddingTop: 20,
            flexDirection: 'row',
            gap: 10,
            alignItems: 'center',
          }}>
          <View style={{borderWidth: 4, width: 20, borderRadius: 4}} />
          <View style={{height: 16, width: 40, borderRadius: 4}} />
        </View>
        {/* Render Schedule Section */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 20,
          }}>
          <View style={{height: 90, width: 120, borderRadius: 20}} />
          <View style={{width: '60%'}}>
            <View style={{width: '100%', height: 15, borderRadius: 4}} />
            <View
              style={{width: '10%', height: 12, borderRadius: 4, marginTop: 4}}
            />
            <View
              style={{width: '40%', height: 15, borderRadius: 4, marginTop: 4}}
            />
          </View>
        </View>
        <View
          style={{
            paddingTop: 20,
            flexDirection: 'row',
            gap: 10,
            alignItems: 'center',
          }}>
          <View style={{borderWidth: 4, width: 20, borderRadius: 4}} />
          <View style={{height: 16, width: 40, borderRadius: 4}} />
        </View>
        {/* Render Schedule Section */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 20,
          }}>
          <View style={{height: 90, width: 120, borderRadius: 20}} />
          <View style={{width: '60%'}}>
            <View style={{width: '100%', height: 15, borderRadius: 4}} />
            <View
              style={{width: '10%', height: 12, borderRadius: 4, marginTop: 4}}
            />
            <View
              style={{width: '40%', height: 15, borderRadius: 4, marginTop: 4}}
            />
          </View>
        </View>

        <View
          style={{
            paddingTop: 20,
            flexDirection: 'row',
            gap: 10,
            alignItems: 'center',
          }}>
          <View style={{borderWidth: 4, width: 20, borderRadius: 4}} />
          <View style={{height: 16, width: 40, borderRadius: 4}} />
        </View>
        {/* Render Schedule Section */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 20,
          }}>
          <View style={{height: 90, width: 120, borderRadius: 20}} />
          <View style={{width: '60%'}}>
            <View style={{width: '100%', height: 15, borderRadius: 4}} />
            <View
              style={{width: '10%', height: 12, borderRadius: 4, marginTop: 4}}
            />
            <View
              style={{width: '40%', height: 15, borderRadius: 4, marginTop: 4}}
            />
          </View>
        </View>
      </View>
    </SkeletonPlaceholder>
  );
}
