import React from 'react';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import AAText from '../ui/text';
import {Colors, FontSize} from '../constants/constants';
interface IAnimeItemCard {
  title?: string;
  image: string;
  type?: string;
  onPress?: () => void;
}

const AnimeItemCard: React.FC<IAnimeItemCard> = ({image, onPress, type}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <Image source={{uri: image}} style={styles.image} />
      <AAText ignoretheme style={styles.type}>
        {type}
      </AAText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 5,
  },
  image: {
    width: '100%',
    height: 280,
    objectFit: 'cover',
    borderRadius: 8,
  },
  type: {
    position: 'absolute',
    zIndex: 1,
    right: 10,
    top: 10,
    backgroundColor: Colors.Pink,
    paddingHorizontal: 10,
    borderRadius: 8,
    fontSize: FontSize.xmd,
    color: Colors.White,
  },
});

export default AnimeItemCard;
