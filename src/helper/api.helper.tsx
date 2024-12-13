import {BASE_URL} from '../../env';
// const SOURCE1="gogoanime";
const SOURCE2 = 'zoroanime';
export const getTopAiringAnime = async (page?: number) => {
  const response = await fetch(
    `${BASE_URL}/api/${SOURCE2}/topairing?page=${page}`,
  );
  const data = await response.json();
  return data;
};

export const getPopularAnime = async (page?: number) => {
  const response = await fetch(
    `${BASE_URL}/api/${SOURCE2}/popularanime?page=${page}`,
  );
  const data = await response.json();
  return data;
};

export const getAnimeDetail = async (id: string) => {
  const response = await fetch(`${BASE_URL}/api/${SOURCE2}/animeinfo?id=${id}`);
  const data = await response.json();
  return data;
};

export const getEpisodeSource = async (id: string) => {
  const response = await fetch(
    `${BASE_URL}/api/${SOURCE2}/episodesource?id=${id}`,
  );
  const data = await response.json();
  return data;
};

export const getSpotLight = async () => {
  const response = await fetch(`${BASE_URL}/api/${SOURCE2}/spotlight`);
  const data = await response.json();
  return data;
};

export const getRecentlyUpdated = async (page?: number) => {
  const response = await fetch(
    `${BASE_URL}/api/${SOURCE2}/recentlyupdated?page=${page}`,
  );
  const data = await response.json();
  return data;
};

export const getReleaseSchedule = async (date: string) => {
  const response = await fetch(
    `${BASE_URL}/api/${SOURCE2}/schedule?date=${date}`,
  );
  if (!response.ok) {
    console.error('Error fetching schedule:', response.statusText);
    throw new Error('Failed to fetch schedule');
  }

  const data = await response.json();
  return data;
};

export const getAnimeSearchResults = async (query: string) => {
  const response = await fetch(`${BASE_URL}/api/${SOURCE2}/search?q=${query}`);
  const data = await response.json();
  return data;
};

export const getFilteredAnimeResults = async (filters: {
  sort: string | null;
  type: string | null;
  status: string | null;
  genres: string[];
}) => {
  try {
    console.log('Filters:', filters);
    const response = await fetch(`${BASE_URL}/api/${SOURCE2}/filtersearch`, {
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
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch filtered anime results:', error);
    throw error;
  }
};
