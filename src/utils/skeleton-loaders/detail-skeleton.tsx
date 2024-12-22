/* eslint-disable react-native/no-inline-styles */
import {View} from 'react-native';
import React from 'react';
import SkeletonSlider from './slider-skeleton';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {useTheme} from '../../wrappers/theme-context';
import SkeletonAnimeCard from './anime-card-skeleton';

export default function SkeletonDetail() {
  const {theme} = useTheme();

  return (
    <View>
      <SkeletonSlider />
      <SkeletonPlaceholder
        backgroundColor={theme.colors.skeletonBackgroung}
        highlightColor={theme.colors.skeletonHighlight}>
        <View style={{padding: 20}}>
          {/* Header Section */}
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

          {/* Button Section */}
          <View
            style={{
              flexDirection: 'row',
              marginTop: 20,
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                flex: 1,
                height: 40,
                borderRadius: 15,
                backgroundColor: theme.colors.skeletonHighlight,
                marginRight: 10,
              }}
            />
            <View
              style={{
                flex: 1,
                height: 40,
                borderRadius: 15,
                backgroundColor: theme.colors.skeletonHighlight,
              }}
            />
          </View>

          {/* Text Rows */}
          <View style={{marginTop: 20}}>
            {[100, 98, 90, 95, 20].map((width, index) => (
              <View
                key={index}
                style={{
                  width: `${width}%`,
                  height: 10,
                  marginBottom: 5,
                  backgroundColor: theme.colors.skeletonHighlight,
                }}
              />
            ))}
          </View>

          {/* Footer Section */}
          <View
            style={{
              marginTop: 20,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                flex: 0.2,
                height: 20,
                backgroundColor: theme.colors.skeletonHighlight,
              }}
            />
            <View
              style={{
                flex: 0.6,
                height: 40,
                backgroundColor: theme.colors.skeletonHighlight,
              }}
            />
          </View>

          {/* Flex Rows */}
          <View
            style={{
              flexDirection: 'row',
              marginTop: 20,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            {Array.from({length: 2}).map((_, index) => (
              <View
                key={index}
                style={{
                  flex: 1,
                  height: 110,
                  borderRadius: 5,
                  backgroundColor: theme.colors.skeletonHighlight,
                  marginRight: 10,
                }}
              />
            ))}
            <View
              style={{
                width: 20,
                height: 110,
                borderRadius: 5,
                backgroundColor: theme.colors.skeletonHighlight,
              }}
            />
          </View>
          {/* Text Rows */}
          <View style={{marginTop: 20}}>
            {[100, 98, 90, 95, 20].map((width, index) => (
              <View
                key={index}
                style={{
                  width: `${width}%`,
                  height: 10,
                  marginBottom: 5,
                  backgroundColor: theme.colors.skeletonHighlight,
                }}
              />
            ))}
          </View>
        </View>
      </SkeletonPlaceholder>
      <SkeletonAnimeCard />
    </View>
  );
}
