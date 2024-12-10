export type Genre = string;

export interface AnimeResult {
  id: string;
  title: string;
  image: string;
  url: string;
  genres?: Genre[];
  episodeId: string;
  episodeNumber: number;
  duration?: string;
  japaneseTitle?: string;
  type?: string;
  sub?: number;
  dub?: number;
  episodes?: number;
}

export interface AnimeResponse {
  currentPage: number;
  hasNextPage: boolean;
  results: AnimeResult[];
}

export interface Episode {
  id: string;
  number: number;
  url: string;
}

export interface Anime {
  id: string;
  title: string;
  url: string;
  genres: string[];
  totalEpisodes: number;
  image: string;
  releaseDate: string;
  description: string;
  subOrDub: 'sub' | 'dub';
  type: string;
  status: string;
  otherName: string;
  episodes: Episode[];
  recommendations?: AnimeResult[];
}

export interface IEpisodeSource {
  name: string;
  url: string;
}

export interface ISpotLightResult {
  id: string;
  title: string;
  japaneseTitle: string;
  banner: string;
  rank: number;
  url: string;
  type: string;
  duration: string;
  releaseDate: string;
  quality: string;
  sub: number;
  dub: number;
  episodes: number;
  description: string;
}

export interface ISpotLight {
  results: ISpotLightResult[];
}

export type RootStackParamList = {
  Tabs: undefined;
  Detail: {id: string};
  VideoScreen: {id: string};
  Search: undefined;
  SortAndFilter: undefined;
};

export type DateItem = {
  id: string;
  day: number;
  weekday: string;
};
