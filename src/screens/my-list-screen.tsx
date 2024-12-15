import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  View,
} from 'react-native';
import LayoutWrapper from '../wrappers/layout-wrapper';
import AAText from '../ui/text';
import {useMyList} from '../helper/storage.helper';
import {Colors} from '../constants/constants';
import AnimeItemCard from '../components/anime-items-cards';
import {getAnimeDetail} from '../helper/api.helper';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import SecondaryNavBar from '../components/secondary-navbar';

export default function MyList() {
  const {myList} = useMyList();
  const [animeDetails, setAnimeDetails] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigation = useNavigation<StackNavigationProp<any>>();

  const navigateToDetail = (id: string) => {
    navigation.navigate('Detail', {id});
  };
  const fetchAnimeDetails = async (id: string) => {
    try {
      const result = await getAnimeDetail(id);
      return result;
    } catch (error) {
      console.error('Error fetching anime details:', error);
    }
  };

  useEffect(() => {
    setLoading(true);
    const fetchDetails = async () => {
      const details = await Promise.all(
        myList.map(id => fetchAnimeDetails(id)),
      );
      setAnimeDetails(details);
      setLoading(false);
    };

    fetchDetails();
  }, [myList]);

  const renderAnimeItem = ({item}: {item: any}) => (
    <AnimeItemCard
      title={item.title}
      image={item.image}
      onPress={() => navigateToDetail(item.id)}
    />
  );
  if (loading) {
    return (
      <LayoutWrapper>
        <View style={styles.loadingIndicator}>
          <ActivityIndicator size="large" color={Colors.Pink} />
        </View>
      </LayoutWrapper>
    );
  }

  return (
    <LayoutWrapper>
      <SecondaryNavBar title="Mylist" />
      <View style={styles.container}>
        {animeDetails.length === 0 ? (
          <View style={styles.emptyDesc}>
            <Image
              source={require('../../assets/images/empty.png')}
              style={styles.emptyImage}
            />
            <AAText ignoretheme style={styles.emptyText}>
              Your List is Empty
            </AAText>
            <AAText style={styles.emptySubText}>
              It seems that you haven't added any anime to the list
            </AAText>
          </View>
        ) : (
          <FlatList
            data={animeDetails}
            showsVerticalScrollIndicator={false}
            renderItem={renderAnimeItem}
            keyExtractor={item => item.id}
            numColumns={2}
            columnWrapperStyle={styles.row}
          />
        )}
      </View>
    </LayoutWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  navTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
  },
  emptyImage: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
  },
  emptyDesc: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    gap: 10,
  },
  emptyText: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.Pink,
  },
  emptySubText: {
    textAlign: 'center',
    fontSize: 18,
    maxWidth: 300,
  },
  row: {
    justifyContent: 'space-between',
  },
  loadingIndicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
