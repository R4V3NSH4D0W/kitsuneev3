import {StyleSheet, View} from 'react-native';
import React from 'react';
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
  return (
    <View style={styles.container}>
      <AAText style={styles.titleText}>Episodes</AAText>
      <View style={styles.buttonContainer}>
        {data.map((episode, index) => (
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  titleText: {
    fontSize: 20,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    gap: 8,
  },
  button: {
    minWidth: 50,
    borderRadius: 5,
    borderColor: Colors.Green,
  },
  buttonText: {
    color: Colors.Green,
  },
});
