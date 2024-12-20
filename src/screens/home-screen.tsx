import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
} from 'react-native';

import Slider from '../components/slider';
import AnimeCard from '../components/AnimeCard';

import {
  getSpotLight,
  getPopularAnime,
  getTopAiringAnime,
  getRecentlyUpdated,
  getMostFavorite,
  getMovie,
} from '../helper/api.helper';
import {Colors} from '../constants/constants';
import LayoutWrapper from '../wrappers/layout-wrapper';
import {AnimeResult, ISpotLightResult} from '../constants/types';
import {useContinueWatching} from '../helper/storage.helper';

export default function HomeScreen() {
  const [spotLight, setSpotLight] = useState<ISpotLightResult[]>([]);
  const [popularAnime, setPopularAnime] = useState<AnimeResult[]>([]);
  const [topAiringAnime, setTopAiringAnime] = useState<AnimeResult[]>([]);
  const [recentlyUpdated, setRecentlyUpdated] = useState<AnimeResult[]>([]);
  const [mostFavorite, setMostFavorite] = useState<AnimeResult[]>([]);
  const [movie, setMovie] = useState<AnimeResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const {continueWatching} = useContinueWatching();
  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [
        topAiringResult,
        popularAnimeResult,
        spotLightResult,
        recentlyUpdatedResult,
        mostFavoriteResult,
        movieResult,
      ] = await Promise.all([
        getTopAiringAnime(),
        getPopularAnime(),
        getSpotLight(),
        getRecentlyUpdated(),
        getMostFavorite(),
        getMovie(),
      ]);

      setSpotLight(spotLightResult.results || []);
      setTopAiringAnime(topAiringResult.results || []);
      setPopularAnime(popularAnimeResult.results || []);
      setRecentlyUpdated(recentlyUpdatedResult.results || []);
      setMostFavorite(mostFavoriteResult.results || []);
      setMovie(movieResult.results || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAllData();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  if (loading) {
    return (
      <LayoutWrapper>
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={Colors.Pink} />
        </View>
      </LayoutWrapper>
    );
  }

  return (
    <LayoutWrapper>
      <ScrollView
        // eslint-disable-next-line react-native/no-inline-styles
        style={{marginBottom: continueWatching ? 80 : 0}}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.Pink]}
          />
        }>
        <Slider data={spotLight} />
        <AnimeCard title="Top Airing" data={topAiringAnime} />
        <AnimeCard title="New Episode Releases" data={recentlyUpdated} />
        <AnimeCard title="Most Popular" data={popularAnime} />
        <AnimeCard title="Most Favorite" data={mostFavorite} />
        <AnimeCard title="Movies" data={movie} />
      </ScrollView>
    </LayoutWrapper>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
