import React from 'react';
import {StyleSheet, View, FlatList} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {useTheme} from '../../wrappers/theme-context';

const SkeletonAnimeCard = () => {
  const {theme} = useTheme();

  const skeletonItems = Array(5).fill(null);

  return (
    <View style={styles.container}>
      <SkeletonPlaceholder
        backgroundColor={theme.colors.skeletonBackground}
        highlightColor={theme.colors.skeletonHighlight}>
        <View style={styles.titleRow}>
          <View style={styles.title} />
          <View style={styles.titleButton} />
        </View>
      </SkeletonPlaceholder>

      <FlatList
        horizontal
        data={skeletonItems}
        keyExtractor={(item, index) => `skeleton-${index}`}
        renderItem={() => (
          <SkeletonPlaceholder
            backgroundColor={theme.colors.skeletonBackground}
            highlightColor={theme.colors.skeletonHighlight}>
            <View style={styles.imageContainer}>
              <View style={styles.image} />
            </View>
          </SkeletonPlaceholder>
        )}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default SkeletonAnimeCard;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingLeft: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  title: {
    height: 20,
    width: 150,
    borderRadius: 4,
  },
  titleButton: {
    height: 20,
    width: 50,
    marginRight: 20,
    borderRadius: 4,
  },
  imageContainer: {
    height: 200,
    width: 140,
    marginRight: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
});
