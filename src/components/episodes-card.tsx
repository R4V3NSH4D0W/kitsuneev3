import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import AAText from '../ui/text';
import AAButton from '../ui/button';

import {Episode} from '../constants/types';
import {Colors} from '../constants/constants';

interface IEpisodeCardProps {
  data: Episode[];
}

export default function EpisodeCard({data}: IEpisodeCardProps) {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [visibleItems, setVisibleItems] = useState(12);

  const handleViewMore = () => {
    setVisibleItems(prev => Math.min(prev + 12, data.length));
  };

  return (
    <View style={styles.container}>
      <AAText style={styles.titleText}>Episodes</AAText>
      <View style={styles.buttonContainer}>
        {data.slice(0, visibleItems).map((episode, index) => (
          <AAButton
            ignoreTheme
            key={index}
            title={index + 1}
            onPress={() => {
              navigation.navigate('VideoScreen', {id: episode.id});
            }}
            style={styles.button}
            textStyle={styles.buttonText}
          />
        ))}
      </View>
      {visibleItems < data.length && (
        <AAButton
          ignoreTheme
          title="View More"
          onPress={handleViewMore}
          style={styles.viewMoreButton}
          textStyle={styles.buttonText}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  titleText: {
    fontSize: 24,
    fontWeight: '500',
  },
  buttonContainer: {
    gap: 8,
    marginTop: 10,
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  button: {
    width: '30%',
    maxWidth: 60,
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Colors.Green,
  },
  viewMoreButton: {
    padding: 10,
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Colors.Green,
  },
  buttonText: {
    fontSize: 16,
    color: Colors.Green,
  },
});
