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
  altID: number;
  malID: number;
  jikan?: JikanAnimeResponse | null;
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
  VideoScreen: {id: string; episodeNumber: number};
  Search: undefined;
  SortAndFilter: undefined;
  SeeAll: {type: string};
  UpdateScreen: {
    onSkipUpdate?: () => void;
  };
};

export type DateItem = {
  id: string;
  day: number;
  weekday: string;
};

export interface JikanAnimeResponse {
  data: {
    mal_id: number;
    url: string;
    images: {
      jpg: {
        image_url: string;
        small_image_url: string;
        large_image_url: string;
      };
      webp: {
        image_url: string;
        small_image_url: string;
        large_image_url: string;
      };
    };
    trailer: {
      youtube_id: string;
      url: string;
      embed_url: string;
      images: {
        image_url: string;
        small_image_url: string;
        medium_image_url: string;
        large_image_url: string;
        maximum_image_url: string;
      };
    };
    approved: boolean;
    titles: {
      type: string;
      title: string;
    }[];
    title: string;
    title_english: string | null;
    title_japanese: string;
    title_synonyms: string[];
    type: string;
    source: string;
    episodes: number | null;
    status: string;
    airing: boolean;
    aired: {
      from: string;
      to: string | null;
      prop: {
        from: {
          day: number | null;
          month: number | null;
          year: number | null;
        };
        to: {
          day: number | null;
          month: number | null;
          year: number | null;
        };
      };
      string: string;
    };
    duration: string;
    rating: string;
    score: number | null;
    scored_by: number | null;
    rank: number | null;
    popularity: number;
    members: number;
    favorites: number;
    synopsis: string | null;
    background: string | null;
    season: string | null;
    year: number | null;
    broadcast: {
      day: string | null;
      time: string | null;
      timezone: string | null;
      string: string;
    };
    producers: {
      mal_id: number;
      type: string;
      name: string;
      url: string;
    }[];
    licensors: {
      mal_id: number;
      type: string;
      name: string;
      url: string;
    }[];
    studios: {
      mal_id: number;
      type: string;
      name: string;
      url: string;
    }[];
    genres: {
      mal_id: number;
      type: string;
      name: string;
      url: string;
    }[];
    explicit_genres: {
      mal_id: number;
      type: string;
      name: string;
      url: string;
    }[];
    themes: {
      mal_id: number;
      type: string;
      name: string;
      url: string;
    }[];
    demographics: {
      mal_id: number;
      type: string;
      name: string;
      url: string;
    }[];
  };
}
