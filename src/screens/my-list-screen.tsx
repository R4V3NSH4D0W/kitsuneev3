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
import {useContinueWatching, useMyList} from '../helper/storage.helper';
import {Colors} from '../constants/constants';
import AnimeItemCard from '../components/anime-items-cards';
import {getAnimeDetail} from '../helper/api.helper';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import SecondaryNavBar from '../components/secondary-navbar';
import ProviderError from '../components/provider-error';

export default function MyList() {
  const {myList} = useMyList();
  const {continueWatching} = useContinueWatching();
  const [animeDetails, setAnimeDetails] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const navigation = useNavigation<StackNavigationProp<any>>();

  const navigateToDetail = (id: string) => {
    navigation.navigate('Detail', {id});
  };

  const fetchAnimeDetails = async (id: string) => {
    try {
      const result = await getAnimeDetail(id);
      return result;
    } catch (error) {
      setHasError(true);
    }
  };

  useEffect(() => {
    if (myList && myList.length > 0) {
      const fetchDetails = async () => {
        try {
          setLoading(true);
          const details = await Promise.all(
            myList.map(id => fetchAnimeDetails(id)),
          );
          setAnimeDetails(details);
        } catch (error) {
          setHasError(true);
        } finally {
          setLoading(false);
        }
      };

      fetchDetails();
    } else {
      setLoading(false);
    }
  }, [myList]);

  if (hasError) {
    return <ProviderError hasRetry={false} />;
  }

  const renderAnimeItem = ({item}: {item: any}) => (
    <AnimeItemCard
      title={item.title}
      image={item.image}
      type={item.type}
      onPress={() => navigateToDetail(item.id)}
    />
  );

  return (
    <LayoutWrapper>
      <SecondaryNavBar title="Mylist" />
      <View
        // eslint-disable-next-line react-native/no-inline-styles
        style={[styles.container, {marginBottom: continueWatching ? 90 : 0}]}>
        {loading ? (
          <View
            style={[
              styles.loadingIndicator,
              // eslint-disable-next-line react-native/no-inline-styles
              {marginBottom: continueWatching ? 90 : 0},
            ]}>
            <ActivityIndicator size="large" color={Colors.Pink} />
          </View>
        ) : myList.length === 0 ? (
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
            keyExtractor={item => item.id.toString()}
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
