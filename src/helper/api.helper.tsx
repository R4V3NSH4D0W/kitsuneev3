import {BASE_URL} from '../../env';

export const getTopAiringAnime = async (page?: number) => {
  const response = await fetch(
    `${BASE_URL}/api/gogoanime/topairing?page=${page}`,
  );
  const data = await response.json();
  return data;
};

export const getPopularAnime = async (page?: number) => {
  const response = await fetch(
    `${BASE_URL}/api/gogoanime/popularanime?page=${page}`,
  );
  const data = await response.json();
  return data;
};

export const getAnimeDetail = async (id: string) => {
  const response = await fetch(`${BASE_URL}/api/gogoanime/animeinfo?id=${id}`);
  const data = await response.json();
  return data;
};
