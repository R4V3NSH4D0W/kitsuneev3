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
} from '../helper/api.helper';
import {Colors} from '../constants/constants';
import LayoutWrapper from '../wrappers/layout-wrapper';
import {AnimeResult, ISpotLightResult} from '../constants/types';

export default function HomeScreen() {
  const [spotLight, setSpotLight] = useState<ISpotLightResult[]>([]);
  const [popularAnime, setPopularAnime] = useState<AnimeResult[]>([]);
  const [topAiringAnime, setTopAiringAnime] = useState<AnimeResult[]>([]);
  const [recentlyUpdated, setRecentlyUpdated] = useState<AnimeResult[]>([]);
  const [mostFavorite, setMostFavorite] = useState<AnimeResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [
        topAiringResult,
        popularAnimeResult,
        spotLightResult,
        recentlyUpdatedResult,
        mostFavoriteResult,
      ] = await Promise.all([
        getTopAiringAnime(),
        getPopularAnime(),
        getSpotLight(),
        getRecentlyUpdated(),
        getMostFavorite(),
      ]);

      setSpotLight(spotLightResult.results || []);
      setTopAiringAnime(topAiringResult.results || []);
      setPopularAnime(popularAnimeResult.results || []);
      setRecentlyUpdated(recentlyUpdatedResult.results || []);
      setMostFavorite(mostFavoriteResult.results || []);
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
