import {Dimensions, TouchableOpacity, View, StyleSheet} from 'react-native';
import React from 'react';
import {Colors, FontSize} from '../constants/constants';
import {useTheme} from '../wrappers/theme-context';
import {useWatchedEpisodes} from '../helper/storage.helper';
import AAText from '../ui/text';
import {Episode} from '../constants/types';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

interface EpisodeListsProps {
  filteredEpisodes: Episode[];
  episodeNumber: number;
  onEpisodeSelect: (episode: string, EpsNo: number) => void;
}

const {width} = Dimensions.get('window');
const BUTTON_WIDTH = (width - 20) / 6;

export default function EpisodeLists({
  filteredEpisodes,
  episodeNumber,
  onEpisodeSelect,
}: EpisodeListsProps) {
  const {isWatched} = useWatchedEpisodes();
  const {theme} = useTheme();

  if (!filteredEpisodes?.length) {
    return (
      <SkeletonPlaceholder
        backgroundColor={theme.colors.skeletonBackground}
        highlightColor={theme.colors.skeletonHighlight}>
        <View style={styles.container}>
          {[...Array(8)].map((_, index) => (
            <View key={index} style={styles.skeletonEpisodeButton} />
          ))}
        </View>
      </SkeletonPlaceholder>
    );
  }

  return (
    <View style={styles.container}>
      {filteredEpisodes.map(item => {
        const isCurrent = item.number === episodeNumber;
        const watched = isWatched(item.id);

        return (
          <TouchableOpacity
            key={item.id}
            onPress={() => onEpisodeSelect?.(item?.id, item.number)}
            style={[
              styles.episodeButton,
              {
                backgroundColor: isCurrent
                  ? Colors.Pink
                  : watched
                  ? Colors.DarkPink
                  : theme.colors.alt,
              },
            ]}
            accessibilityLabel={`Episode ${item.number}`}>
            <AAText
              ignoretheme
              style={[
                styles.episodeText,
                {
                  color:
                    isCurrent || watched ? Colors.White : theme.colors.text,
                },
              ]}>
              {item.number}
            </AAText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    marginTop: 20,
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  episodeButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: BUTTON_WIDTH,
  },
  episodeText: {
    fontWeight: '600',
    fontSize: FontSize.sm,
  },
  noEpisodesText: {
    textAlign: 'center',
    fontSize: FontSize.md,
    color: Colors.LightGray,
  },
  skeletonEpisodeButton: {
    height: 40,
    width: BUTTON_WIDTH,
    borderRadius: 5,
    padding: 10,
  },
});
