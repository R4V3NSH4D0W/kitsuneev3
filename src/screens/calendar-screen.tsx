import {
  View,
  Image,
  FlatList,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import FIcons from 'react-native-vector-icons/Feather';

import LayoutWrapper from '../wrappers/layout-wrapper';
import AAText from '../ui/text';
import AAButton from '../ui/button';

import {DateItem} from '../constants/types';
import {Colors} from '../constants/constants';

import {
  checkDate,
  generateDates,
  getDeviceDate,
  trimTitle,
} from '../helper/util.helper';
import {getAnimeDetail, getReleaseSchedule} from '../helper/api.helper';

import {useContinueWatching, useMyList} from '../helper/storage.helper';
import {useTheme} from '../wrappers/theme-context';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import AIcons from 'react-native-vector-icons/AntDesign';
import SecondaryNavBar from '../components/secondary-navbar';

const {height} = Dimensions.get('window');

type ScheduleItem = {
  id: string;
  url: string;
  title: string;
  image: string;
  airingTime: string;
  japaneseTitle: string;
  airingEpisode: string;
};

export default function CalendarScreen() {
  const [loading, setLoading] = useState<boolean>(false);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const {continueWatching} = useContinueWatching();

  const {addToList, removeFromList, isInList} = useMyList();
  const {theme} = useTheme();
  const dates: DateItem[] = generateDates();
  const [selectedDate, setSelectedDate] = useState<string | null>(
    dates[0]?.id || null,
  );

  const navigation = useNavigation<StackNavigationProp<any>>();

  const [dateTime, setDateTime] = useState(getDeviceDate());

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(getDeviceDate());
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!selectedDate) {
      return;
    }

    const fetchSchedule = async () => {
      setLoading(true);
      try {
        const data = await getReleaseSchedule(selectedDate);

        const enrichedSchedule = await Promise.all(
          data.results.map(async (item: ScheduleItem) => {
            try {
              const animeInfo = await getAnimeDetail(item.id);
              return {
                ...item,
                image: animeInfo?.image || 'https://via.placeholder.com/150',
              };
            } catch (error) {
              console.error(
                `Error fetching anime info for ID ${item.id}:`,
                error,
              );
              return {
                ...item,
                image: 'https://via.placeholder.com/150',
              };
            }
          }),
        );

        setSchedule(enrichedSchedule);
      } catch (error) {
        console.error('Error fetching schedule:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [selectedDate]);

  const handleDatePress = (dateId: string) => {
    setSelectedDate(dateId);
  };

  const renderCalendarItem = ({item}: {item: DateItem}) => {
    const isSelected = selectedDate === item.id;
    return (
      <TouchableOpacity
        style={[styles.calendar, isSelected && styles.selectedCalendar]}
        onPress={() => handleDatePress(item.id)}>
        <AAText
          ignoretheme={isSelected}
          style={isSelected ? styles.selectedWeekdayText : styles.weekdayText}>
          {item.weekday}
        </AAText>
        <AAText
          ignoretheme={isSelected}
          style={isSelected ? styles.selectedDateText : styles.dateText}>
          {item.day}
        </AAText>
      </TouchableOpacity>
    );
  };

  const renderScheduleItem = ({
    item,
    index,
  }: {
    item: ScheduleItem;
    index: number;
  }) => {
    const previousTime = index > 0 ? schedule[index - 1] : null;

    const currentTime = checkDate(
      selectedDate || '',
      dateTime?.date,
      dateTime?.time,
      item.airingTime,
      previousTime?.airingTime,
    );

    const navigateToDetail = (id: string) => {
      navigation.navigate('Detail', {id});
    };

    const isInMyList = isInList(item.id);

    const handlePress = async () => {
      if (isInMyList) {
        await removeFromList(item.id);
      } else {
        await addToList(item.id);
      }
    };

    return (
      <View style={styles.scheduleContainer}>
        {currentTime && (
          <View style={styles.lineContainer}>
            <View style={styles.line} />
            <AAText style={styles.currentTime}>
              Current Time - {dateTime.time}
            </AAText>
            <View style={styles.line} />
          </View>
        )}
        <View style={styles.time}>
          <View style={styles.smallLine} />
          <AAText>{item.airingTime}</AAText>
        </View>
        <View style={styles.scheduleContent}>
          <TouchableOpacity onPress={() => navigateToDetail(item.id)}>
            <View>
              <Image source={{uri: item.image}} style={styles.image} />
              <AIcons
                name="play"
                size={30}
                color={Colors.White}
                style={styles.playIcon}
              />
            </View>
          </TouchableOpacity>
          <View style={styles.col}>
            <AAText style={styles.title}>{trimTitle(item?.title)}</AAText>
            <AAText style={styles.episode}>{item.airingEpisode}</AAText>
            <AAButton
              ignoreTheme
              title={'My List'}
              style={[
                styles.button,
                isInMyList && {backgroundColor: theme.colors.background},
              ]}
              textStyle={isInMyList ? {color: Colors.Pink} : styles.text}
              onPress={handlePress}
              icon={
                <FIcons
                  size={20}
                  name={isInMyList ? 'check' : 'plus'}
                  color={isInMyList ? Colors.Pink : Colors.White}
                />
              }
            />
          </View>
        </View>
      </View>
    );
  };

  return (
    <LayoutWrapper>
      <SecondaryNavBar title="Schedule" />
      <View
        // eslint-disable-next-line react-native/no-inline-styles
        style={[styles.container, {marginBottom: continueWatching ? 90 : 0}]}>
        <FlatList
          data={dates}
          horizontal
          style={styles.flatList}
          keyExtractor={item => item.id}
          renderItem={renderCalendarItem}
          showsHorizontalScrollIndicator={false}
        />

        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={Colors.Pink} />
          </View>
        ) : schedule.length > 0 ? (
          <FlatList
            data={schedule}
            style={styles.scheduleList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderScheduleItem}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptySchedule}>
            <Image
              source={require('../../assets/images/sad-removebg.png')}
              style={styles.emptyImage}
            />
            <AAText ignoretheme style={styles.noSchedule}>
              No Release Schedule
            </AAText>
            <AAText style={styles.sorry}>
              sorry, there is no anime release schedule on this date
            </AAText>
          </View>
        )}
      </View>
    </LayoutWrapper>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  flatList: {
    marginTop: 20,
    paddingBottom: 20,
  },
  calendar: {
    width: 50,
    height: 80,
    borderWidth: 1,
    marginRight: 12,
    borderRadius: 30,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Colors.Pink,
  },
  selectedCalendar: {
    borderColor: Colors.Pink,
    backgroundColor: Colors.Pink,
  },
  weekdayText: {
    fontSize: 14,
  },
  selectedWeekdayText: {
    fontSize: 14,
    color: Colors.White,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
  },
  selectedDateText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.White,
  },
  scheduleList: {
    marginTop: 20,
  },
  scheduleContainer: {
    paddingTop: 5,
  },
  smallLine: {
    width: 14,
    height: 5,
    borderRadius: 5,
    backgroundColor: Colors.Pink,
  },
  time: {
    gap: 5,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 100,
    marginRight: 10,
    borderRadius: 10,
  },
  scheduleContent: {
    gap: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
  episode: {
    fontSize: 14,
    fontWeight: '400',
  },
  col: {
    gap: 10,
  },
  button: {
    padding: 4,
    width: 110,
    borderRadius: 20,
    borderColor: Colors.Pink,
    backgroundColor: Colors.Pink,
  },
  text: {
    fontWeight: '600',
    color: Colors.White,
  },
  loading: {
    flex: 1,
    marginBottom: height / 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyImage: {
    height: 250,
    width: 350,
    resizeMode: 'contain',
  },
  emptySchedule: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: height / 2.5,
  },
  noSchedule: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.Pink,
  },
  sorry: {
    fontSize: 18,
    marginTop: 10,
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  playIcon: {
    position: 'absolute',
    top: '40%',
    left: '40%',
    // transform: [{translateX: -15}, {translateY: -15}],
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  line: {
    height: 2,
    backgroundColor: Colors.Pink,
    width: '30%',
    marginVertical: 5,
  },
  lineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 10,
  },
  currentTime: {
    fontSize: 14,
  },
});
