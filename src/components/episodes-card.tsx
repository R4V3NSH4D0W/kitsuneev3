import {StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import AAText from '../ui/text';
import {Episode} from '../constants/types';
import AAButton from '../ui/button';
import {Colors} from '../constants/constants';
import {StackNavigationProp} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';

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
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    justifyContent: 'flex-start',
    gap: 8,
  },
  button: {
    width: '30%',
    maxWidth: 60,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.Green,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewMoreButton: {
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.Green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: Colors.Green,
    fontSize: 16,
  },
});
