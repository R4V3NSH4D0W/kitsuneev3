import {getAnimeDetail, getEpisodeSource} from './api.helper';

interface Source {
  isM3U8: boolean;
  url: string;
}

interface EpisodeSources {
  sources: Source[];
}

export const getHlsSource = (
  episodeSources: EpisodeSources | null,
): string | null => {
  if (!episodeSources?.sources) {
    return null;
  }

  const hlsSource = episodeSources.sources.find(source => source.isM3U8)?.url;
  return hlsSource || null;
};

export const fetchAnimeAndEpisodeData = async (
  animeID: string,
  episodeID: string,
) => {
  try {
    const [episodeSources, animeInfo] = await Promise.all([
      getEpisodeSource(episodeID),
      getAnimeDetail(animeID),
    ]);
    return {episodeSources, animeInfo};
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const findEnglishSubtitle = (subtitles: any[]) => {
  return subtitles?.find(subtitle => subtitle.lang === 'English') || null;
};
