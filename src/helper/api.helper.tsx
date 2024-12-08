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
