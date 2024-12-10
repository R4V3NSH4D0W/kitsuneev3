import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ContextProps {
  myList: string[];
  addToList: (id: string) => void;
  removeFromList: (id: string) => void;
  isInList: (id: string) => boolean;

  watchedEpisodes: string[];
  markAsWatched: (id: string, watchedPercentage: number) => void;
  isWatched: (id: string) => boolean;
}

const AppContext = createContext<ContextProps | undefined>(undefined);

export const AppProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [myList, setMyList] = useState<string[]>([]);
  const [watchedEpisodes, setWatchedEpisodes] = useState<string[]>([]);

  useEffect(() => {
    const fetchMyList = async () => {
      try {
        const list = await AsyncStorage.getItem('myList');
        setMyList(list ? JSON.parse(list) : []);
      } catch (error) {
        console.error('Error fetching My List:', error);
      }
    };

    const fetchWatchedEpisodes = async () => {
      try {
        const storedEpisodes = await AsyncStorage.getItem('watchedEpisodes');
        setWatchedEpisodes(storedEpisodes ? JSON.parse(storedEpisodes) : []);
      } catch (error) {
        console.error('Error fetching Watched Episodes:', error);
      }
    };

    fetchMyList();
    fetchWatchedEpisodes();
  }, []);

  const addToList = async (id: string) => {
    try {
      const updatedList = [...myList, id];
      setMyList(updatedList);
      await AsyncStorage.setItem('myList', JSON.stringify(updatedList));
    } catch (error) {
      console.error('Error adding to My List:', error);
    }
  };

  const removeFromList = async (id: string) => {
    try {
      const updatedList = myList.filter(item => item !== id);
      setMyList(updatedList);
      await AsyncStorage.setItem('myList', JSON.stringify(updatedList));
    } catch (error) {
      console.error('Error removing from My List:', error);
    }
  };

  const isInList = (id: string) => myList.includes(id);

  const markAsWatched = async (id: string, watchedPercentage: number) => {
    if (watchedPercentage >= 30 && !watchedEpisodes.includes(id)) {
      try {
        const updatedEpisodes = [...watchedEpisodes, id];
        setWatchedEpisodes(updatedEpisodes);
        await AsyncStorage.setItem(
          'watchedEpisodes',
          JSON.stringify(updatedEpisodes),
        );
      } catch (error) {
        console.error('Error marking episode as watched:', error);
      }
    }
  };

  const isWatched = (id: string) => watchedEpisodes.includes(id);

  return (
    <AppContext.Provider
      value={{
        myList,
        addToList,
        removeFromList,
        isInList,
        watchedEpisodes,
        markAsWatched,
        isWatched,
      }}>
      {children}
    </AppContext.Provider>
  );
};

export const useMyList = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useMyList must be used within AppProvider');
  }
  return {
    myList: context.myList,
    addToList: context.addToList,
    removeFromList: context.removeFromList,
    isInList: context.isInList,
  };
};

export const useWatchedEpisodes = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useWatchedEpisodes must be used within AppProvider');
  }
  return {
    watchedEpisodes: context.watchedEpisodes,
    markAsWatched: context.markAsWatched,
    isWatched: context.isWatched,
  };
};
