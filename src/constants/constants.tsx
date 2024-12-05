export interface Theme {
  dark: boolean;
  colors: {
    background: string;
    text: string;
    primary: string;
    secondary: string;
    miniumTintColor: string;
    maxiumTintColor: string;
  };
}

export const Colors = {
  Green: '#0bc248',
  White: '#ffffff',
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
  },
};

export const darkTheme: Theme = {
  dark: true,
  colors: {
    background: '#121212',
    text: '#ffffff',
    primary: '#121212',
    secondary: '#CF6679',
    miniumTintColor: '#FFFFFF',
    maxiumTintColor: '#808080',
  },
};
