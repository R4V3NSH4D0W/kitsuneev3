import React, {useEffect, useState} from 'react';
import {ActivityIndicator, View, ScrollView, StyleSheet} from 'react-native';

import Slider from '../components/slider';
import NavBar from '../components/navbar';
import AnimeCard from '../components/AnimeCard';

import {
  getSpotLight,
  getPopularAnime,
  getTopAiringAnime,
  getRecentlyUpdated,
} from '../helper/api.helper';
import {Colors} from '../constants/constants';
import LayoutWrapper from '../wrappers/layout-wrapper';
import {AnimeResult, ISpotLightResult} from '../constants/types';

export default function HomeScreen() {
  const [spotLight, setSpotLight] = useState<ISpotLightResult[]>([]);
  const [popularAnime, setPopularAnime] = useState<AnimeResult[]>([]);
  const [topAiringAnime, setTopAiringAnime] = useState<AnimeResult[]>([]);
  const [recentlyUpdated, setRecentlyUpdated] = useState<AnimeResult[]>([]);

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

      setSpotLight(spotLightResult.results || []);
      setTopAiringAnime(topAiringResult.results || []);
      setPopularAnime(popularAnimeResult.results || []);
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
          <ActivityIndicator size="large" color={Colors.Green} />
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
    alignItems: 'center',
    justifyContent: 'center',
  },
});
