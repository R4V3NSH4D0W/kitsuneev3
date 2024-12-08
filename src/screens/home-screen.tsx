import {ActivityIndicator, View, ScrollView, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import LayoutWrapper from '../wrappers/layout-wrapper';
import Slider from '../components/slider';
import AnimeCard from '../components/AnimeCard';
import {
  getPopularAnime,
  getRecentlyUpdated,
  getSpotLight,
  getTopAiringAnime,
} from '../helper/api.helper';
import {AnimeResult, ISpotLightResult} from '../constants/types';
import NavBar from '../components/navbar';

export default function HomeScreen() {
  const [topAiringAnime, setTopAiringAnime] = useState<AnimeResult[]>([]);
  const [popularAnime, setPopularAnime] = useState<AnimeResult[]>([]);
  const [recentlyUpdated, setRecentlyUpdated] = useState<AnimeResult[]>([]);
  const [spotLight, setSpotLight] = useState<ISpotLightResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [
        topAiringResult,
        popularAnimeResult,
        spotLightResult,
        recentlyUpdatedResult,
      ] = await Promise.all([
        getTopAiringAnime(),
        getPopularAnime(),
        getSpotLight(),
        getRecentlyUpdated(),
      ]);

      setTopAiringAnime(topAiringResult.results || []);
      setPopularAnime(popularAnimeResult.results || []);
      setSpotLight(spotLightResult.results || []);
      setRecentlyUpdated(recentlyUpdatedResult.results || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  if (loading) {
    return (
      <LayoutWrapper>
        <View style={styles.loading}>
          <ActivityIndicator size="large" />
        </View>
      </LayoutWrapper>
    );
  }

  return (
    <LayoutWrapper>
      <NavBar />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Slider data={spotLight} />
        <AnimeCard title="Recently Updated" data={recentlyUpdated} />
        <AnimeCard title="Top Airing" data={topAiringAnime} />
        <AnimeCard title="Popular Anime" data={popularAnime} />
      </ScrollView>
    </LayoutWrapper>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
