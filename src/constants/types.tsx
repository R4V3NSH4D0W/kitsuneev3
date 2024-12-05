export type Genre = string;

export interface AnimeResult {
  id: string;
  title: string;
  image: string;
  url: string;
  genres: Genre[];
  episodeId: string;
  episodeNumber: number;
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
}

export type RootStackParamList = {
  Tabs: undefined;
  Detail: {id: string};
  VideoScreen: {id: string};
};
