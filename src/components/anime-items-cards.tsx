import React from 'react';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';
interface IAnimeItemCard {
  title?: string;
  image: string;
  onPress?: () => void;
}

const AnimeItemCard: React.FC<IAnimeItemCard> = ({image, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <Image source={{uri: image}} style={styles.image} />
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
});

export default AnimeItemCard;
