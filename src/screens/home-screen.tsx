import {ScrollView, StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import LayoutWrapper from '../wrappers/layout-wrapper';
import Slider from '../components/slider';
import AnimeCard from '../components/AnimeCard';
import {getPopularAnime, getTopAiringAnime} from '../helper/api.helper';
import {AnimeResponse, AnimeResult} from '../constants/types';

export default function HomeScreen() {
  const [topAiringAnime, setTopAiringAnime] = useState<AnimeResult[]>([]);
  const [popularAnime, setPopularAnime] = useState<AnimeResult[]>([]);

  const [loading, setLoading] = useState<boolean>(true);

  const fetchTopAiringAnime = async () => {
    setLoading(true);
    try {
      const result: AnimeResponse = await getTopAiringAnime();
      setTopAiringAnime(result.results || []);
    } catch (error) {
      console.error('Error fetching anime:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPopularAnime = async () => {
    setLoading(true);
    try {
      const result: AnimeResponse = await getPopularAnime();
      setPopularAnime(result.results || []);
    } catch (error) {
      console.error('Error fetching anime:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopAiringAnime();
    fetchPopularAnime();
  }, []);

  return (
    <LayoutWrapper>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Slider />
        <AnimeCard
          title="Top Airing"
          isloading={loading}
          data={topAiringAnime}
        />
        <AnimeCard
          title="Popular Anime"
          isloading={loading}
          data={popularAnime}
        />
      </ScrollView>
    </LayoutWrapper>
  );
}

const styles = StyleSheet.create({});
