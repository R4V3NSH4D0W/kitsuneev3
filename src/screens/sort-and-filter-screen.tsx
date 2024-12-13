import React, {useCallback, useState} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import {useTheme} from '../wrappers/theme-context';
import LayoutWrapper from '../wrappers/layout-wrapper';
import AAText from '../ui/text';
import AAButton from '../ui/button';
import {Genres, Colors, Status, Type, Sort} from '../constants/constants';
import SortFilterCard from '../components/sort-filter-card';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {getFilteredAnimeResults} from '../helper/api.helper';

export default function SortAndFilter() {
  const {theme} = useTheme();

  const navigation = useNavigation<StackNavigationProp<any>>();

  const [selectedSort, setSelectedSort] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  const [resetState, setResetState] = useState(false);

  const handleSortSelection = useCallback(
    (selected: {id: number; title: string}) =>
      setSelectedSort(selected.title.toLowerCase()),
    [],
  );

  const handleTypeSelection = useCallback(
    (selected: {id: number; title: string}) =>
      setSelectedType(selected.title.toLowerCase()),
    [],
  );

  const handleStatusSelection = useCallback(
    (selected: {id: number; title: string}) =>
      setSelectedStatus(selected.title.toLowerCase()),
    [],
  );

  const handleGenreSelection = useCallback(
    (selected: {id: number; title: string}) => {
      setSelectedGenres(prev =>
        prev.includes(selected.title.toLowerCase())
          ? prev.filter(item => item !== selected.title.toLowerCase())
          : [...prev, selected.title.toLowerCase()],
      );
    },
    [],
  );

  const handleReset = useCallback(() => {
    setResetState(true);
    setSelectedSort(null);
    setSelectedType(null);
    setSelectedStatus(null);
    setSelectedGenres([]);
    setTimeout(() => {
      setResetState(false);
    }, 0);
  }, []);

  const applyFilters = async () => {
    const filters = {
      sort: selectedSort,
      type: selectedType,
      status: selectedStatus,
      genres: selectedGenres,
    };

    console.log('Applying Filters:', filters);

    try {
      const result = await getFilteredAnimeResults(filters);
      console.log('Filtered Results:', result);
      Alert.alert('Success', 'Filters applied successfully.');
    } catch (error) {
      console.error('Failed to apply filters:', error);
      Alert.alert('Error', 'Failed to fetch results. Please try again.');
    }
  };

  return (
    <LayoutWrapper>
      <View style={styles.navContain}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icons name="arrow-back" size={26} color={theme.colors.text} />
        </TouchableOpacity>
        <AAText style={styles.navTitle}>Sort & Filter</AAText>
      </View>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <SortFilterCard
          title="Sort"
          data={Sort}
          onPress={handleSortSelection}
          reset={resetState}
        />
        <SortFilterCard
          title="Type"
          data={Type}
          onPress={handleTypeSelection}
          reset={resetState}
        />
        <SortFilterCard
          title="Status"
          data={Status}
          onPress={handleStatusSelection}
          reset={resetState}
        />
        <SortFilterCard
          title="Genre"
          data={Genres}
          onPress={handleGenreSelection}
          isMultiSelect={true}
          reset={resetState}
        />
      </ScrollView>
      <View
        style={[
          styles.buttonContainer,
          {
            borderBlockColor: theme.colors.alt,
            borderLeftColor: theme.colors.alt,
            borderRightColor: theme.colors.alt,
          },
        ]}>
        <AAButton
          title="Reset"
          textStyle={styles.text}
          style={[styles.button, {backgroundColor: theme.colors.alt}]}
          onPress={handleReset}
        />
        <AAButton
          title="Apply"
          textStyle={styles.text}
          style={[styles.button, {backgroundColor: Colors.Pink}]}
          onPress={applyFilters}
        />
      </View>
    </LayoutWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  navContain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    padding: 20,
  },
  navTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 30,
  },
  button: {
    width: '45%',
    height: 60,
    borderRadius: 30,
    borderWidth: 0,
  },
  text: {
    fontWeight: '600',
  },
});
