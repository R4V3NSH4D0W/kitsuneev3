import React, {useEffect, useState} from 'react';
import {ScrollView, RefreshControl, StyleSheet} from 'react-native';

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
import SkeletonAnimeCard from '../utils/skeleton-loaders/anime-card-skeleton';
import SkeletonSlider from '../utils/skeleton-loaders/slider-skeleton';
import ProviderError from '../components/provider-error';
import NavBar from '../components/navbar';

export default function HomeScreen() {
  const [spotLight, setSpotLight] = useState<ISpotLightResult[]>([]);
  const [popularAnime, setPopularAnime] = useState<AnimeResult[]>([]);
  const [topAiringAnime, setTopAiringAnime] = useState<AnimeResult[]>([]);
  const [recentlyUpdated, setRecentlyUpdated] = useState<AnimeResult[]>([]);
  const [mostFavorite, setMostFavorite] = useState<AnimeResult[]>([]);
  const [movie, setMovie] = useState<AnimeResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const {continueWatching} = useContinueWatching();

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setHasError(false);
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
      setHasError(true);
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
        <SkeletonSlider />
        <SkeletonAnimeCard />
        <SkeletonAnimeCard />
        <SkeletonAnimeCard />
      </LayoutWrapper>
    );
  }

  if (hasError) {
    return <ProviderError onRetry={onRefresh} />;
  }

  return (
    <LayoutWrapper>
      <ScrollView
        key={loading ? 'loading' : 'loaded'}
        // eslint-disable-next-line react-native/no-inline-styles
        style={[styles.scrollView, {marginBottom: continueWatching ? 80 : 0}]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.Pink]}
          />
        }>
        <NavBar />
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
  scrollView: {
    flex: 1,
  },
});
