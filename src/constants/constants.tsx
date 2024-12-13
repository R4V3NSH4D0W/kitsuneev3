export interface Theme {
  dark: boolean;
  colors: {
    background: string;
    text: string;
    primary: string;
    secondary: string;
    miniumTintColor: string;
    maxiumTintColor: string;
    alt: string;
  };
}

export const Colors = {
  Pink: '#ea376b',
  White: '#ffffff',
  LightGray: '#1e222a',
};

export const lightTheme: Theme = {
  dark: false,
  colors: {
    background: '#ffffff',
    text: '#000000',
    primary: '#ffff',
    secondary: '#f44336',
    miniumTintColor: '#091227',
    maxiumTintColor: '#D4D4D4',
    alt: '#F8f8f8',
  },
};

export const darkTheme: Theme = {
  dark: true,
  colors: {
    background: '#181a20',
    text: '#ffffff',
    primary: ' #181a20',
    secondary: '#CF6679',
    miniumTintColor: '#FFFFFF',
    maxiumTintColor: '#808080',
    alt: '#1e222a',
  },
};
export interface IWidht {
  small: number;
}

export const DeviceWidth: IWidht = {
  small: 411.42857142857144,
};

export const Genres = [
  {id: 1, title: 'Action'},
  {id: 2, title: 'Adventure'},
  {id: 3, title: 'Cars'},
  {id: 4, title: 'Comedy'},
  {id: 5, title: 'Dementia'},
  {id: 6, title: 'Demons'},
  {id: 7, title: 'Drama'},
  {id: 8, title: 'Ecchi'},
  {id: 9, title: 'Fantasy'},
  {id: 10, title: 'Game'},
  {id: 11, title: 'Harem'},
  {id: 12, title: 'Historical'},
  {id: 13, title: 'Horror'},
  {id: 14, title: 'Isekai'},
  {id: 15, title: 'Josei'},
  {id: 16, title: 'Kids'},
  {id: 17, title: 'Magic'},
  {id: 18, title: 'Martial Arts'},
  {id: 19, title: 'Mecha'},
  {id: 20, title: 'Military'},
  {id: 21, title: 'Music'},
  {id: 22, title: 'Mystery'},
  {id: 23, title: 'Parody'},
  {id: 24, title: 'Police'},
  {id: 25, title: 'Psychological'},
  {id: 26, title: 'Romance'},
  {id: 27, title: 'Samurai'},
  {id: 28, title: 'School'},
  {id: 29, title: 'Sci-Fi'},
  {id: 30, title: 'Seinen'},
  {id: 31, title: 'Shoujo'},
  {id: 32, title: 'Shoujo Ai'},
  {id: 33, title: 'Shounen'},
  {id: 34, title: 'Shounen Ai'},
  {id: 35, title: 'Slice of Life'},
  {id: 36, title: 'Space'},
  {id: 37, title: 'Sports'},
  {id: 38, title: 'Super Power'},
  {id: 39, title: 'Supernatural'},
  {id: 40, title: 'Thriller'},
  {id: 41, title: 'Vampire'},
];

export const Sort = [
  {id: 1, title: 'Popularity'},
  {id: 3, title: 'Title'},
  {id: 2, title: 'Recently updated'},
  {id: 4, title: 'Movies'},
  {id: 5, title: 'Recently premiered'},
];

export const Type = [
  {id: 1, title: 'TV'},
  {id: 2, title: 'Movie'},
  {id: 3, title: 'OVA'},
  {id: 4, title: 'ONA'},
  {id: 5, title: 'Special'},
  {id: 6, title: 'Music'},
];

export const Status = [
  {id: 1, title: 'All'},
  {id: 2, title: 'Finished Airing'},
  {id: 3, title: 'Currently Airing'},
  {id: 4, title: 'Upcoming'},
];
