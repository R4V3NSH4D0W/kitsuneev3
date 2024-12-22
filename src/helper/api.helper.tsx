import {BASE_URL} from '../../env';

const SOURCE2 = 'zoroanime';

type FetchOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
};

const fetchData = async (
  endpoint: string,
  options: FetchOptions = {},
): Promise<any> => {
  try {
    const response = await fetch(
      `${BASE_URL}/api/${SOURCE2}/${endpoint}`,
      options,
    );
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch ${endpoint}:`, error);
    throw error;
  }
};

export const getTopAiringAnime = (page?: number): Promise<any> =>
  fetchData(`topairing?page=${page}`);

export const getPopularAnime = (page?: number): Promise<any> =>
  fetchData(`popularanime?page=${page}`);

export const getAnimeDetail = (id: string): Promise<any> =>
  fetchData(`animeinfo?id=${id}`);

export const getEpisodeSource = (id: string): Promise<any> =>
  fetchData(`episodesource?id=${id}`);

export const getSpotLight = (): Promise<any> => fetchData('spotlight');

export const getRecentlyUpdated = (page?: number): Promise<any> =>
  fetchData(`recentlyupdated?page=${page}`);

export const getMovie = (page?: number): Promise<any> =>
  fetchData(`movie?page=${page}`);

export const getReleaseSchedule = (date: string): Promise<any> =>
  fetchData(`schedule?date=${date}`);

export const getAnimeSearchResults = (query: string): Promise<any> =>
  fetchData(`search?q=${query}`);

export const getMostFavorite = (page?: number): Promise<any> =>
  fetchData(`mostfavorite?page=${page}`);

export const getZoroWorking = (): Promise<any> => fetchData('iszoroworking');

export const getFilteredAnimeResults = (filters: {
  sort: string | null;
  type: string | null;
  status: string | null;
  genres: string[];
}): Promise<any> => {
  const options: FetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sort: filters.sort,
      type: filters.type,
      status: filters.status,
      genres: filters.genres || [],
    }),
  };
  return fetchData('filtersearch', options);
};
