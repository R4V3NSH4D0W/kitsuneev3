import {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useMyList() {
  const [myList, setMyList] = useState<string[]>([]);

  useEffect(() => {
    const fetchMyList = async () => {
      try {
        const list = await AsyncStorage.getItem('myList');
        setMyList(list ? JSON.parse(list) : []);
      } catch (error) {
        console.error('Error fetching My List:', error);
      }
    };

    fetchMyList();
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

  return {myList, addToList, removeFromList, isInList};
}
